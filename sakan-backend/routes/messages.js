const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { uploadMessage, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

const TYPING_TTL_MS = 7000;
const typingState = new Map();

const typingKey = (senderId, receiverId) => `${String(senderId)}:${String(receiverId)}`;

const setTyping = (senderId, receiverId) => {
  typingState.set(typingKey(senderId, receiverId), Date.now());
};

const clearTyping = (senderId, receiverId) => {
  typingState.delete(typingKey(senderId, receiverId));
};

const isTypingActive = (senderId, receiverId) => {
  const key = typingKey(senderId, receiverId);
  const ts = typingState.get(key);
  if (!ts) return false;
  if (Date.now() - ts > TYPING_TTL_MS) {
    typingState.delete(key);
    return false;
  }
  return true;
};

// ════════════════════���═══════════════════════════════���═
// GET /api/messages/unread/count  — total unread count
// ═════════���═══════════════════════════════���════════════
router.get('/unread/count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══���═══════════════════════════════���═══════════════════
// GET /api/messages/conversations  — list all conversations
// ═════════════════════���═══════════════════════════════���
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Get latest message of each conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender'],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$isRead', false] }] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          user: { _id: 1, name: 1, photo: 1, isOnline: 1, lastSeen: 1 },
          lastMessage: { text: 1, createdAt: 1, isRead: 1, sender: 1 },
          unreadCount: 1,
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    const me = String(req.user._id);
    const withTyping = conversations.map((conv) => ({
      ...conv,
      isTyping: isTypingActive(String(conv?.user?._id || ''), me),
    }));

    res.json({ success: true, conversations: withTyping });
  } catch (err) {
    console.error('CONVERSATIONS ERROR:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/messages/typing/start/:userId  — typing ON
// ══════════════════════════════════════════════════════
router.post('/typing/start/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = String(req.user._id);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Destinataire invalide.' });
    }

    if (String(userId) === myId) {
      return res.status(400).json({ success: false, message: 'Operation invalide.' });
    }

    setTyping(myId, userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/messages/typing/stop/:userId  — typing OFF
// ══════════════════════════════════════════════════════
router.post('/typing/stop/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = String(req.user._id);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Destinataire invalide.' });
    }

    clearTyping(myId, userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════════════════════════════════════════════
// GET /api/messages/:userId  — get messages with a user
// ═════════════���═══════════════════════════════���════════
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId,   receiver: userId },
        { sender: userId, receiver: myId   },
      ],
    })
      .sort({ createdAt: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('sender',   'name photo')
      .populate('receiver', 'name photo');

    // Mark unread messages as read
    await Message.updateMany(
      { sender: userId, receiver: myId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      messages,
      isTyping: isTypingActive(String(userId), String(myId)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════���═══════════════════════════════���═══════
// POST /api/messages/:userId  — send a message
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
// POST /api/messages/upload/image  — upload image for chat
// ══════════════════════════════════════════════════════
router.post('/upload/image', protect, uploadMessage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucune image fournie.' });
    }

    res.json({
      success: true,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
    });
  } catch (err) {
    console.error('MESSAGE IMAGE UPLOAD ERROR:', err);
    res.status(500).json({ success: false, message: 'Erreur upload image.' });
  }
});

// ══════════════════════════════════════════════════════
// POST /api/messages/:userId  — send a message
// ══════════════════════════════════════════════════════
router.post('/:userId', protect, async (req, res) => {
  try {
    const { text, imageUrl, imagePublicId } = req.body;
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Destinataire invalide.' });
    }

    const hasText = text && text.trim();
    const hasImage = imageUrl && imagePublicId;

    if (!hasText && !hasImage) {
      return res.status(400).json({ success: false, message: 'Message ou image requis.' });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Tu ne peux pas t\'envoyer un message.' });
    }

    const receiver = await User.findById(userId).select('_id');
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Destinataire introuvable.' });
    }

    const message = await Message.create({
      sender:   req.user._id,
      receiver: userId,
      text:     hasText ? text.trim() : '',
      imageUrl: imageUrl || null,
      imagePublicId: imagePublicId || null,
    });

    await message.populate('sender', 'name photo');
    await message.populate('receiver', 'name photo');

    clearTyping(req.user._id, userId);

    res.status(201).json({ success: true, message });
  } catch (err) {
    console.error('MESSAGE ERROR:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;