const express = require('express');

const router = express.Router();


const {

  chat,

  getConversations,

  getConversationMessages,

  deleteConversation

} = require('../controllers/aiController');


const {
  authenticateToken
} = require('../middleware/authMiddleware');


// =====================================================
// AI CHAT
// =====================================================

router.post(
  '/chat',
  authenticateToken,
  chat
);


// =====================================================
// GET USER CONVERSATIONS
// =====================================================

router.get(
  '/conversations',
  authenticateToken,
  getConversations
);


// =====================================================
// GET MESSAGES OF ONE CONVERSATION
// =====================================================

router.get(
  '/conversations/:id/messages',
  authenticateToken,
  getConversationMessages
);


// =====================================================
// DELETE CONVERSATION
// =====================================================

router.delete(
  '/conversations/:id',
  authenticateToken,
  deleteConversation
);


module.exports = router;