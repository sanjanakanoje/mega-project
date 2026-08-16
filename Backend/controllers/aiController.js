

const pool = require('../config/db');

const {
  getUserAIContext
} = require('../services/aiContextService');

const {
  generateAIResponse
} = require('../services/aiService');


// =====================================================
// AI CHAT
// =====================================================

async function chat(req, res) {

  try {

    console.log('\n======================================');
    console.log('          AI CHAT REQUEST');
    console.log('======================================');


    // ===================================================
    // AUTHENTICATED USER
    // ===================================================

    console.log('REQ.USER:', req.user);

    const userId =
      req.user?.id ||
      req.user?.userId ||
      req.user?.UserID;

    const role =
      req.user?.role ||
      req.user?.Role;


    console.log('USER ID:', userId);
    console.log('ROLE:', role);


    if (!userId) {

      console.error('❌ USER ID MISSING');

      return res.status(401).json({
        success: false,
        message: 'User authentication information missing'
      });

    }


    // ===================================================
    // MESSAGE
    // ===================================================

    const userMessage =
      req.body?.message?.trim();


    console.log('USER MESSAGE:', userMessage);


    if (!userMessage) {

      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });

    }


    // ===================================================
    // CONVERSATION
    // ===================================================

    let conversationId =
      req.body?.conversationId || null;


    // =====================================================
    // VERIFY CONVERSATION OWNERSHIP
    // =====================================================

    if (conversationId) {

      const conversationCheck =
        await pool.query(
          `
          SELECT id
          FROM ai_conversations

          WHERE id = $1
          AND user_id = $2
          `,
          [
            conversationId,
            userId
          ]
        );


      if (
        conversationCheck.rows.length === 0
      ) {

        // Conversation belongs to another user
        conversationId = null;

      }

    }


    console.log(
      'Received Conversation ID:',
      conversationId
    );


    // ===================================================
    // CREATE NEW CONVERSATION
    // ===================================================

    if (!conversationId) {

      console.log(
        'Creating new AI conversation...'
      );


      const conversationResult =
        await pool.query(
          `
          INSERT INTO ai_conversations
          (user_id, title)
          VALUES ($1, $2)
          RETURNING id
          `,
          [
            userId,
            userMessage.substring(0, 100)
          ]
        );


      conversationId =
        conversationResult.rows[0].id;


      console.log(
        '✅ New Conversation ID:',
        conversationId
      );

    }


    // ===================================================
    // GET HISTORY
    // ===================================================

    console.log(
      'Getting conversation history...'
    );


    const historyResult =
      await pool.query(
        `
        SELECT
          role,
          message
        FROM ai_messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC
        LIMIT 10
        `,
        [conversationId]
      );


    const history =
      historyResult.rows;


    console.log(
      '✅ History Count:',
      history.length
    );


    // ===================================================
    // GET USER DATABASE CONTEXT
    // ===================================================

    console.log(
      'Getting user AI context...'
    );


    const context =
      await getUserAIContext(
        userId,
        role
      );


    console.log(
      '✅ USER AI CONTEXT:',
      JSON.stringify(
        context,
        null,
        2
      )
    );


    // ===================================================
    // SAVE USER MESSAGE
    // ===================================================

    console.log(
      'Saving user message...'
    );


    await pool.query(
      `
      INSERT INTO ai_messages
      (conversation_id, role, message)
      VALUES ($1, $2, $3)
      `,
      [
        conversationId,
        'user',
        userMessage
      ]
    );


    console.log(
      '✅ User message saved'
    );


    // ===================================================
    // GENERATE AI RESPONSE
    // ===================================================

    console.log(
      'Calling Groq AI...'
    );


    const aiResponse =
      await generateAIResponse(
        userMessage,
        context,
        history
      );


    console.log(
      '✅ AI RESPONSE:',
      aiResponse
    );


    // ===================================================
    // SAVE AI RESPONSE
    // ===================================================

    console.log(
      'Saving AI response...'
    );


    await pool.query(
      `
      INSERT INTO ai_messages
      (conversation_id, role, message)
      VALUES ($1, $2, $3)
      `,
      [
        conversationId,
        'assistant',
        aiResponse
      ]
    );


    console.log(
      '✅ AI response saved'
    );


    // ===================================================
    // FINAL RESPONSE
    // ===================================================

    console.log(
      '✅ AI CHAT SUCCESS'
    );

    console.log(
      '======================================\n'
    );


    return res.json({

      success: true,

      conversationId,

      response: aiResponse

    });


  } catch (error) {

    console.error('\n');
    console.error(
      '======================================'
    );
    console.error(
      '❌❌❌ AI CHAT ERROR ❌❌❌'
    );
    console.error(
      '======================================'
    );

    console.error(
      'Error Name:',
      error.name
    );

    console.error(
      'Error Message:',
      error.message
    );

    console.error(
      'Error Code:',
      error.code
    );

    console.error(
      'Full Error:',
      error
    );

    console.error(
      'Stack:',
      error.stack
    );

    console.error(
      '======================================\n'
    );


    return res.status(500).json({

      success: false,

      message:
        'AI service failed. Please try again.',

      // Development debugging only
      error:
        process.env.NODE_ENV !== 'production'
          ? error.message
          : undefined

    });

  }

}



// =====================================================
// GET USER CONVERSATIONS
// =====================================================

async function getConversations(req, res) {

  try {

    const userId =
      req.user?.id ||
      req.user?.userId ||
      req.user?.UserID;

    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "User authentication information missing"
      });

    }

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.title,
        c.created_at,

        (
          SELECT m.message
          FROM ai_messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_message

      FROM ai_conversations c

      WHERE c.user_id = $1

      ORDER BY c.created_at DESC
      `,
      [userId]
    );

    return res.json({

      success: true,

      conversations: result.rows

    });

  }

  catch (error) {

    console.error(
      "GET CONVERSATIONS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to load conversations"

    });

  }

}


// =====================================================
// GET CONVERSATION MESSAGES
// =====================================================

async function getConversationMessages(req, res) {

  try {

    const userId =
      req.user?.id ||
      req.user?.userId ||
      req.user?.UserID;

    const conversationId =
      Number(req.params.id);


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          "User authentication information missing"

      });

    }


    if (!conversationId) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid conversation ID"

      });

    }


    // ===================================================
    // IMPORTANT SECURITY CHECK
    // ===================================================

    const conversationCheck =
      await pool.query(
        `
        SELECT id
        FROM ai_conversations
        WHERE id = $1
        AND user_id = $2
        `,
        [
          conversationId,
          userId
        ]
      );


    if (
      conversationCheck.rows.length === 0
    ) {

      return res.status(403).json({

        success: false,

        message:
          "You are not authorized to access this conversation"

      });

    }


    // ===================================================
    // GET MESSAGES
    // ===================================================

    const result =
      await pool.query(
        `
        SELECT
          id,
          role,
          message,
          created_at

        FROM ai_messages

        WHERE conversation_id = $1

        ORDER BY created_at ASC
        `,
        [
          conversationId
        ]
      );


    return res.json({

      success: true,

      conversationId,

      messages:
        result.rows

    });

  }

  catch (error) {

    console.error(
      "GET CONVERSATION MESSAGES ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to load conversation"

    });

  }

}


// =====================================================
// DELETE CONVERSATION
// =====================================================

async function deleteConversation(req, res) {

  try {

    const userId =
      req.user?.id ||
      req.user?.userId ||
      req.user?.UserID;

    const conversationId =
      Number(req.params.id);


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          "User authentication information missing"

      });

    }


    // ===================================================
    // CHECK OWNERSHIP
    // ===================================================

    const check =
      await pool.query(
        `
        SELECT id
        FROM ai_conversations
        WHERE id = $1
        AND user_id = $2
        `,
        [
          conversationId,
          userId
        ]
      );


    if (check.rows.length === 0) {

      return res.status(403).json({

        success: false,

        message:
          "You are not authorized to delete this conversation"

      });

    }


    // ===================================================
    // DELETE MESSAGES
    // ===================================================

    await pool.query(
      `
      DELETE FROM ai_messages
      WHERE conversation_id = $1
      `,
      [
        conversationId
      ]
    );


    // ===================================================
    // DELETE CONVERSATION
    // ===================================================

    await pool.query(
      `
      DELETE FROM ai_conversations
      WHERE id = $1
      AND user_id = $2
      `,
      [
        conversationId,
        userId
      ]
    );


    return res.json({

      success: true,

      message:
        "Conversation deleted successfully"

    });

  }

  catch (error) {

    console.error(
      "DELETE CONVERSATION ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete conversation"

    });

  }

}


module.exports = {

  chat,

  getConversations,

  getConversationMessages,

  deleteConversation

};