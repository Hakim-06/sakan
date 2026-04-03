const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

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

    res.json({ success: true, conversations });
  } catch (err) {
    console.error('CONVERSATIONS ERROR:', err);
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

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ══════════════���═══════════════════════════════���═══════
// POST /api/messages/:userId  — send a message
// ══════════════════════════════════════════════════════
router.post('/:userId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const { userId } = req.params;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message vide.' });
    }
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Tu ne peux pas t\'envoyer un message.' });
    }

    const message = await Message.create({
      sender:   req.user._id,
      receiver: userId,
      text:     text.trim(),
    });

    await message.populate('sender', 'name photo');
    await message.populate('receiver', 'name photo');

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;