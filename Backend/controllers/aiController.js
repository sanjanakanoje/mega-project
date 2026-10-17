// controllers/aiController.js

const pool = require('../config/db');

const {
  getUserAIContext
} = require('../services/aiContextService');

const {
  generateAIResponse
} = require('../services/aiService');


// =====================================================
// HELPER: GET AUTHENTICATED USER
// =====================================================

function getAuthenticatedUser(req) {
  const user = req.user || {};

  const userId =
    user.id ??
    user.userId ??
    user.UserID ??
    user.userid ??
    user.user_id;

  const role =
    user.role ??
    user.Role ??
    user.ROLE ??
    user.user_role ??
    null;

  return {
    userId,
    role
  };
}


// =====================================================
// HELPER: VALIDATE CONVERSATION ID
// =====================================================

function getConversationId(value) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return null;
  }

  const conversationId = Number(value);

  if (
    !Number.isInteger(conversationId) ||
    conversationId <= 0
  ) {
    return undefined;
  }

  return conversationId;
}


// =====================================================
// HELPER: GET REPORT STATUS FOR LOGGED-IN USER
// =====================================================

async function getUserReportStatus(userId) {
  try {
    console.log('Checking report status for user:', userId);

    /*
      test_requests:
        id
        customer_id

      test_reports:
        id
        sample_id
        test_name
        created_at
    */

    const result = await pool.query(
      `
      SELECT
        tr.sample_id,
        COUNT(tr.id)::int AS report_count,
        ARRAY_AGG(DISTINCT tr.test_name)
          FILTER (WHERE tr.test_name IS NOT NULL)
          AS generated_tests

      FROM test_reports tr

      INNER JOIN test_requests ts
        ON ts.id = tr.sample_id

      WHERE ts.customer_id = $1

      GROUP BY tr.sample_id

      ORDER BY tr.sample_id
      `,
      [userId]
    );

    console.log(
      'Report status records:',
      result.rows
    );

    if (result.rows.length === 0) {
      return {
        success: true,
        reports: [],
        contextText:
          'REPORT STATUS: No generated reports were found for this customer.'
      };
    }

    const reportLines = result.rows.map(report => {
      const tests =
        Array.isArray(report.generated_tests)
          ? report.generated_tests.join(', ')
          : 'Test information unavailable';

      return `
Sample ID: ${report.sample_id}
Generated Report Count: ${report.report_count}
Generated Tests: ${tests}
Final Report Status: GENERATED
`;
    });

    return {
      success: true,
      reports: result.rows,
      contextText: `
================ REPORT STATUS INFORMATION ================

${reportLines.join('\n')}

Important:
- If a sample has a generated report count greater than 0,
  consider its report as GENERATED.
- Do not say "final report has not yet been generated"
  when report status is GENERATED.
- If the user asks about a particular sample ID,
  use the matching Sample ID information.
============================================================
`
    };

  } catch (error) {
    console.error(
      'GET USER REPORT STATUS ERROR:',
      error
    );

    /*
      Do not stop the complete AI chat if report status
      query fails. Return safe context instead.
    */

    return {
      success: false,
      reports: [],
      contextText: `
REPORT STATUS INFORMATION:
Report status is currently unavailable.
Do not make a definite claim about report generation.
`
    };
  }
}


// =====================================================
// HELPER: EXTRACT SAMPLE ID FROM MESSAGE
// =====================================================

function extractSampleId(message) {
  if (
    typeof message !== 'string' ||
    !message.trim()
  ) {
    return null;
  }

  const patterns = [
    /sample\s*id\s*[:#-]?\s*(\d+)/i,
    /sample\s*(\d+)/i,
    /id\s*[:#-]?\s*(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);

    if (match && match[1]) {
      const sampleId = Number(match[1]);

      if (
        Number.isInteger(sampleId) &&
        sampleId > 0
      ) {
        return sampleId;
      }
    }
  }

  return null;
}


// =====================================================
// HELPER: CHECK PARTICULAR SAMPLE REPORT
// =====================================================

async function getParticularSampleReportStatus(
  userId,
  sampleId
) {
  if (!sampleId) {
    return null;
  }

  try {
    const result = await pool.query(
      `
      SELECT
        tr.sample_id,
        COUNT(tr.id)::int AS report_count,
        ARRAY_AGG(DISTINCT tr.test_name)
          FILTER (WHERE tr.test_name IS NOT NULL)
          AS generated_tests

      FROM test_reports tr

      INNER JOIN test_requests ts
        ON ts.id = tr.sample_id

      WHERE ts.customer_id = $1
      AND tr.sample_id = $2

      GROUP BY tr.sample_id
      `,
      [
        userId,
        sampleId
      ]
    );

    if (result.rows.length === 0) {
      return {
        sampleId,
        reportCount: 0,
        reportGenerated: false,
        generatedTests: []
      };
    }

    const report = result.rows[0];

    return {
      sampleId: report.sample_id,
      reportCount: Number(report.report_count || 0),
      reportGenerated:
        Number(report.report_count || 0) > 0,
      generatedTests:
        Array.isArray(report.generated_tests)
          ? report.generated_tests
          : []
    };

  } catch (error) {
    console.error(
      'GET PARTICULAR SAMPLE REPORT ERROR:',
      error
    );

    return null;
  }
}


// =====================================================
// AI CHAT
// =====================================================

async function chat(req, res) {
  let client = null;
  let transactionStarted = false;

  try {
    console.log('\n======================================');
    console.log('          AI CHAT REQUEST');
    console.log('======================================');

    // -------------------------------------------------
    // 1. AUTHENTICATED USER
    // -------------------------------------------------

    const {
      userId,
      role
    } = getAuthenticatedUser(req);

    console.log('REQ.USER:', req.user);
    console.log('USER ID:', userId);
    console.log('ROLE:', role);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'User authentication information missing'
      });
    }

    // -------------------------------------------------
    // 2. VALIDATE MESSAGE
    // -------------------------------------------------

    const rawMessage = req.body?.message;

    const userMessage =
      typeof rawMessage === 'string'
        ? rawMessage.trim()
        : '';

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (userMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long'
      });
    }

    // -------------------------------------------------
    // 3. CONVERSATION ID
    // -------------------------------------------------

    const conversationIdInput =
      getConversationId(
        req.body?.conversationId
      );

    if (conversationIdInput === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID'
      });
    }

    let conversationId = conversationIdInput;

    console.log(
      'Received Conversation ID:',
      conversationId
    );

    // -------------------------------------------------
    // 4. CHECK GROQ API KEY
    // -------------------------------------------------

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');

      return res.status(500).json({
        success: false,
        message:
          'AI service is not configured. Please contact the administrator.'
      });
    }

    // -------------------------------------------------
    // 5. GET DATABASE CLIENT
    // -------------------------------------------------

    client = await pool.connect();

    // -------------------------------------------------
    // 6. START TRANSACTION
    // -------------------------------------------------

    await client.query('BEGIN');
    transactionStarted = true;

    // -------------------------------------------------
    // 7. VERIFY OR CREATE CONVERSATION
    // -------------------------------------------------

    if (conversationId !== null) {
      const conversationCheck = await client.query(
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

      if (conversationCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        transactionStarted = false;

        return res.status(403).json({
          success: false,
          message:
            'You are not authorized to access this conversation'
        });
      }
    } else {
      console.log(
        'Creating new AI conversation...'
      );

      const conversationResult = await client.query(
        `
        INSERT INTO ai_conversations
        (
          user_id,
          title
        )
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
        'New Conversation ID:',
        conversationId
      );
    }

    // -------------------------------------------------
    // 8. GET CONVERSATION HISTORY
    // -------------------------------------------------

    const historyResult = await client.query(
      `
      SELECT
        role,
        message
      FROM ai_messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      LIMIT 10
      `,
      [
        conversationId
      ]
    );

    const history = historyResult.rows;

    console.log(
      'History Count:',
      history.length
    );

    // -------------------------------------------------
    // 9. GET USER DATABASE CONTEXT
    // -------------------------------------------------

    console.log(
      'Getting user AI context...'
    );

    const context =
      await getUserAIContext(
        userId,
        role
      );

    console.log(
      'User AI Context Generated'
    );

    // -------------------------------------------------
    // 10. GET REPORT STATUS CONTEXT
    // -------------------------------------------------

    const reportStatus =
      await getUserReportStatus(userId);

    const sampleId =
      extractSampleId(userMessage);

    let particularReportStatus = null;

    if (sampleId) {
      particularReportStatus =
        await getParticularSampleReportStatus(
          userId,
          sampleId
        );

      console.log(
        'Particular Sample Report Status:',
        particularReportStatus
      );
    }

    // -------------------------------------------------
    // 11. PREPARE ENRICHED AI CONTEXT
    // -------------------------------------------------

    let enrichedContext = `
================ USER DATABASE CONTEXT ================

${typeof context === 'string'
  ? context
  : JSON.stringify(context, null, 2)}

================ REPORT STATUS CONTEXT ================

${reportStatus.contextText}
`;

    if (particularReportStatus) {
      enrichedContext += `
================ PARTICULAR SAMPLE REPORT ================

Sample ID: ${particularReportStatus.sampleId}
Report Count: ${particularReportStatus.reportCount}
Report Generated:
${particularReportStatus.reportGenerated ? 'YES' : 'NO'}

Generated Tests:
${
  particularReportStatus.generatedTests.length > 0
    ? particularReportStatus.generatedTests.join(', ')
    : 'No generated tests found'
}

Important:
${
  particularReportStatus.reportGenerated
    ? `The report for Sample ID ${particularReportStatus.sampleId}
has been generated. Do not say that the report is not generated.`
    : `No report record was found for Sample ID ${particularReportStatus.sampleId}.`
}
`;
    }

    console.log(
      'Enriched AI Context Generated'
    );

    // -------------------------------------------------
    // 12. GENERATE AI RESPONSE
    // -------------------------------------------------

    console.log(
      'Calling Groq AI...'
    );

    const aiResponse =
      await generateAIResponse(
        userMessage,
        enrichedContext,
        history
      );

    if (
      typeof aiResponse !== 'string' ||
      !aiResponse.trim()
    ) {
      throw new Error(
        'AI returned an empty response'
      );
    }

    const cleanedAIResponse =
      aiResponse.trim();

    console.log(
      'AI Response:',
      cleanedAIResponse
    );

    // -------------------------------------------------
    // 13. SAVE USER MESSAGE
    // -------------------------------------------------

    await client.query(
      `
      INSERT INTO ai_messages
      (
        conversation_id,
        role,
        message
      )
      VALUES ($1, $2, $3)
      `,
      [
        conversationId,
        'user',
        userMessage
      ]
    );

    // -------------------------------------------------
    // 14. SAVE AI RESPONSE
    // -------------------------------------------------

    await client.query(
      `
      INSERT INTO ai_messages
      (
        conversation_id,
        role,
        message
      )
      VALUES ($1, $2, $3)
      `,
      [
        conversationId,
        'assistant',
        cleanedAIResponse
      ]
    );

    // -------------------------------------------------
    // 15. COMMIT TRANSACTION
    // -------------------------------------------------

    await client.query('COMMIT');
    transactionStarted = false;

    console.log(
      'AI CHAT SUCCESS'
    );

    // -------------------------------------------------
    // 16. SEND RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      conversationId,
      response: cleanedAIResponse
    });

  } catch (error) {
    console.error(
      '\n======================================'
    );

    console.error(
      'AI CHAT ERROR'
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
      'Error Status:',
      error.status
    );

    console.error(
      'Stack:',
      error.stack
    );

    // -------------------------------------------------
    // ROLLBACK
    // -------------------------------------------------

    if (
      client &&
      transactionStarted
    ) {
      try {
        await client.query(
          'ROLLBACK'
        );
      } catch (rollbackError) {
        console.error(
          'Rollback Error:',
          rollbackError.message
        );
      }
    }

    // -------------------------------------------------
    // ERROR RESPONSE
    // -------------------------------------------------

    let statusCode = 500;

    let message =
      'AI service failed. Please try again.';

    // Groq rate limit
    if (
      error.status === 429 ||
      error.code === '429'
    ) {
      statusCode = 429;

      message =
        'AI service rate limit reached. Please try again later.';
    }

    // PostgreSQL duplicate error
    else if (
      error.code === '23505'
    ) {
      statusCode = 409;

      message =
        'A duplicate record was detected. Please try again.';
    }

    // PostgreSQL foreign key error
    else if (
      error.code === '23503'
    ) {
      statusCode = 400;

      message =
        'Invalid database reference. Please try again.';
    }

    // PostgreSQL connection error
    else if (
      error.code === 'ECONNREFUSED' ||
      error.code === '57P01'
    ) {
      statusCode = 503;

      message =
        'Database service is currently unavailable.';
    }

    const response = {
      success: false,
      message
    };

    if (
      process.env.NODE_ENV !== 'production'
    ) {
      response.error =
        error.message;
    }

    return res.status(statusCode).json(
      response
    );

  } finally {
    if (client) {
      client.release();
    }
  }
}


// =====================================================
// GET USER CONVERSATIONS
// =====================================================

async function getConversations(req, res) {
  try {
    const {
      userId
    } = getAuthenticatedUser(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'User authentication information missing'
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
      [
        userId
      ]
    );

    return res.status(200).json({
      success: true,
      conversations: result.rows
    });

  } catch (error) {
    console.error(
      'GET CONVERSATIONS ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to load conversations'
    });
  }
}


// =====================================================
// GET CONVERSATION MESSAGES
// =====================================================

async function getConversationMessages(req, res) {
  try {
    const {
      userId
    } = getAuthenticatedUser(req);

    const conversationId =
      getConversationId(
        req.params.id
      );

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'User authentication information missing'
      });
    }

    if (conversationId === undefined) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid conversation ID'
      });
    }

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
          'You are not authorized to access this conversation'
      });
    }

    const result = await pool.query(
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

    return res.status(200).json({
      success: true,
      conversationId,
      messages: result.rows
    });

  } catch (error) {
    console.error(
      'GET CONVERSATION MESSAGES ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to load conversation'
    });
  }
}


// =====================================================
// DELETE CONVERSATION
// =====================================================

async function deleteConversation(req, res) {
  let client = null;
  let transactionStarted = false;

  try {
    const {
      userId
    } = getAuthenticatedUser(req);

    const conversationId =
      getConversationId(
        req.params.id
      );

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'User authentication information missing'
      });
    }

    if (conversationId === undefined) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid conversation ID'
      });
    }

    client = await pool.connect();

    await client.query('BEGIN');
    transactionStarted = true;

    const check = await client.query(
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
      check.rows.length === 0
    ) {
      await client.query(
        'ROLLBACK'
      );

      transactionStarted = false;

      return res.status(403).json({
        success: false,
        message:
          'You are not authorized to delete this conversation'
      });
    }

    await client.query(
      `
      DELETE FROM ai_messages
      WHERE conversation_id = $1
      `,
      [
        conversationId
      ]
    );

    await client.query(
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

    await client.query(
      'COMMIT'
    );

    transactionStarted = false;

    return res.status(200).json({
      success: true,
      message:
        'Conversation deleted successfully'
    });

  } catch (error) {
    console.error(
      'DELETE CONVERSATION ERROR:',
      error
    );

    if (
      client &&
      transactionStarted
    ) {
      try {
        await client.query(
          'ROLLBACK'
        );
      } catch (rollbackError) {
        console.error(
          'Rollback Error:',
          rollbackError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to delete conversation'
    });

  } finally {
    if (client) {
      client.release();
    }
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  chat,
  getConversations,
  getConversationMessages,
  deleteConversation
};