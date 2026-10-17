// const express = require('express');

// const router = express.Router();


// const {

//   chat,

//   getConversations,

//   getConversationMessages,

//   deleteConversation

// } = require('../controllers/aiController');


// const {
//   authenticateToken
// } = require('../middleware/authMiddleware');


// // =====================================================
// // AI CHAT
// // =====================================================

// router.post(
//   '/chat',
//   authenticateToken,
//   chat
// );


// // =====================================================
// // GET USER CONVERSATIONS
// // =====================================================

// router.get(
//   '/conversations',
//   authenticateToken,
//   getConversations
// );


// // =====================================================
// // GET MESSAGES OF ONE CONVERSATION
// // =====================================================

// router.get(
//   '/conversations/:id/messages',
//   authenticateToken,
//   getConversationMessages
// );


// // =====================================================
// // DELETE CONVERSATION
// // =====================================================

// router.delete(
//   '/conversations/:id',
//   authenticateToken,
//   deleteConversation
// );


// module.exports = router;


const express = require('express');

const router = express.Router();

// Controllers
const aiController = require('../controllers/aiController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

const {
  chat,
  getConversations,
  getConversationMessages,
  deleteConversation
} = aiController;

const {
  authenticateToken
} = authMiddleware;


// =====================================================
// DEBUG: Check imported functions
// =====================================================

console.log('AI Controller functions:', {
  chat: typeof chat,
  getConversations: typeof getConversations,
  getConversationMessages: typeof getConversationMessages,
  deleteConversation: typeof deleteConversation
});

console.log('Auth middleware:', {
  authenticateToken: typeof authenticateToken
});


// =====================================================
// AI CHAT
// =====================================================

if (
  typeof authenticateToken !== 'function' ||
  typeof chat !== 'function'
) {
  throw new TypeError(
    'Invalid AI chat route handler. Check aiController.js and authMiddleware.js exports.'
  );
}

router.post(
  '/chat',
  authenticateToken,
  chat
);


// =====================================================
// GET USER CONVERSATIONS
// =====================================================

if (
  typeof authenticateToken !== 'function' ||
  typeof getConversations !== 'function'
) {
  throw new TypeError(
    'Invalid get conversations route handler. Check aiController.js exports.'
  );
}

router.get(
  '/conversations',
  authenticateToken,
  getConversations
);


// =====================================================
// GET CONVERSATION MESSAGES
// =====================================================

if (
  typeof authenticateToken !== 'function' ||
  typeof getConversationMessages !== 'function'
) {
  throw new TypeError(
    'Invalid conversation messages route handler. Check aiController.js exports.'
  );
}

router.get(
  '/conversations/:id/messages',
  authenticateToken,
  getConversationMessages
);


// =====================================================
// DELETE CONVERSATION
// =====================================================

if (
  typeof authenticateToken !== 'function' ||
  typeof deleteConversation !== 'function'
) {
  throw new TypeError(
    'Invalid delete conversation route handler. Check aiController.js exports.'
  );
}

router.delete(
  '/conversations/:id',
  authenticateToken,
  deleteConversation
);


module.exports = router;