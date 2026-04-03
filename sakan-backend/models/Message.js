const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender requis'],
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver requis'],
  },

  text: {
    type: String,
    required: [true, 'Message requis'],
    maxlength: [2000, 'Maximum 2000 caractères'],
    trim: true,
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  readAt: {
    type: Date,
    default: null,
  },

}, { timestamps: true });

MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ receiver: 1, isRead: 1 });

module.exports = mongoose.model('Message', MessageSchema);