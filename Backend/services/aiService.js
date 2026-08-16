// const OpenAI = require('openai');
// const pool = require('../config/db');


// const groq = new OpenAI({
//   apiKey: process.env.GROQ_API_KEY,
//   baseURL: 'https://api.groq.com/openai/v1'
// });


// const MODEL = 'llama-3.3-70b-versatile';


// async function generateAIResponse(
//   userId,
//   role,
//   conversationId,
//   userMessage,
//   context
// ) {

//   try {

//     // =====================================================
//     // GET PREVIOUS CHAT HISTORY
//     // =====================================================

//     let history = [];

//     if (conversationId) {

//       const historyResult = await pool.query(
//         `
//         SELECT
//           role,
//           message
//         FROM ai_messages
//         WHERE conversation_id = $1
//         ORDER BY created_at ASC
//         LIMIT 20
//         `,
//         [conversationId]
//       );

//       history = historyResult.rows;

//     }


//     // =====================================================
//     // SYSTEM INSTRUCTION
//     // =====================================================

//     const systemPrompt = `
// You are the AI Assistant for a Smart Textile Lab Management System.

// You help customers and laboratory staff.

// CURRENT USER:
// ${JSON.stringify(context.user, null, 2)}

// USER ROLE:
// ${role}

// IMPORTANT RULES:

// 1. Never ask the user for their UserID.
// 2. Never ask the user for their SampleID if the required information can be identified from the provided database context.
// 3. Automatically use the current logged-in user's data.
// 4. Understand natural language such as:
//    - my sample
//    - my latest sample
//    - my report
//    - my tests
//    - my request
//    - where is my sample
//    - what is the status
//    - what happened to my sample
// 5. If multiple records exist, use the most recent or most relevant record whenever the question allows it.
// 6. Use previous conversation history to understand references such as:
//    - it
//    - that sample
//    - that report
//    - the latest one
// 7. Never invent database information.
// 8. Only claim a sample status, test result, report status, tracking stage, or request detail when it is supported by the provided database context.
// 9. If the requested information is genuinely not available in the context, clearly say that the information is not available.
// 10. Do not expose SQL queries, database credentials, JWT tokens, or internal implementation details.
// 11. Answer naturally and clearly.
// 12. For general textile questions, answer using your general knowledge.
// 13. For user-specific project questions, prioritize the provided database context over general knowledge.
// 14. If the user asks something unrelated to textile testing or this application, politely answer if it is a normal general question, but do not pretend it is project data.
// 15. Never reveal another customer's private information.
// 16. Keep answers concise but useful.

// DATABASE CONTEXT:

// SAMPLES:
// ${JSON.stringify(context.samples, null, 2)}

// TRACKING:
// ${JSON.stringify(context.tracking, null, 2)}

// TESTS PERFORMED:
// ${JSON.stringify(context.tests, null, 2)}

// REPORTS:
// ${JSON.stringify(context.reports, null, 2)}

// TEST REQUESTS:
// ${JSON.stringify(context.testRequests, null, 2)}
// `;


//     // =====================================================
//     // GROQ MESSAGES
//     // =====================================================

//     const messages = [

//       {
//         role: 'system',
//         content: systemPrompt
//       },

//       ...history.map(item => ({
//         role:
//           item.role === 'assistant'
//             ? 'assistant'
//             : 'user',

//         content: item.message
//       })),

//       {
//         role: 'user',
//         content: userMessage
//       }

//     ];


//     // =====================================================
//     // CALL GROQ
//     // =====================================================

//     const completion =
//       await groq.chat.completions.create({

//         model: MODEL,

//         messages: messages,

//         temperature: 0.2,

//         max_tokens: 1000

//       });


//     const response =
//       completion.choices?.[0]?.message?.content;


//     if (!response) {

//       throw new Error(
//         'AI returned an empty response'
//       );

//     }


//     return response;

//   }

//   catch (error) {

//     console.error(
//       'AI SERVICE ERROR:',
//       error
//     );

//     throw error;

//   }

// }


// module.exports = {
//   generateAIResponse
// };






// const Groq = require('groq-sdk');

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });


// // =====================================================
// // GENERATE AI RESPONSE
// // =====================================================

// async function generateAIResponse(userMessage, context, history = []) {

//   try {

//     // ===================================================
//     // SYSTEM PROMPT
//     // ===================================================

//     const systemPrompt = `
// You are the AI Assistant for Smart Textile Laboratory.

// You are a database-aware assistant.

// You have access to the logged-in user's information and
// their textile testing information.

// IMPORTANT RULES:

// 1. Always use the provided database context before answering.

// 2. Never ask the user for information that can already be
//    determined from the database context.

// 3. Never invent, guess, or hallucinate database values.

// 4. For test progress, calculate the answer from:
//    testsRequired, completedTests and pendingTests.

// 5. If testsRequired contains 3 tests and completedTests
//    contains 2 tests, answer:
//    - 3 total
//    - 2 completed
//    - 1 pending

// 6. When answering sample-related questions, use both:
//    - samples
//    - testRequests
//    if either contains relevant information.

// 7. A test request can represent the user's submitted sample
//    request even when sample_id is NULL.

// 8. If sample_id is NULL, do NOT say:
//    "There is no sample information."

//    Instead say:
//    "Your test request is recorded in the system, but a sample
//    ID has not yet been assigned."

// 9. If barcode is missing, say:
//    "A barcode has not been assigned yet."

// 10. If DateReceived is missing, say:
//     "The sample received date is not available yet."

// 11. Do not expose internal database terminology such as:
//     "database context", "context object", "SQL query",
//     "JSONB", etc.

// 12. Never tell the user that the AI cannot access the database
//     when relevant information exists in the provided context.

// 13. Answer naturally and directly.

// 14. If information genuinely does not exist, explain what is
//     missing in a user-friendly way.

// 15. Never invent:
//     - sample IDs
//     - barcodes
//     - test results
//     - report results
//     - tracking updates
//     - dates
//     - completion times

// 16. For general textile questions, answer using your general
//     knowledge.

// 17. For user-specific questions, prioritize the provided
//     database information.

// 18. Keep answers concise but informative.

// IMPORTANT DATABASE RULES:

// 1. The logged-in user's test_requests represent submitted sample/test requests.

// 2. If the Samples array is empty but testRequests contains records,
//    DO NOT say that the user has no samples.

// 3. Use testRequests as the source for submitted sample information.

// 4. The number of submitted samples can be determined from testRequests
//    when Samples is empty.

// 5. Do not say "the samples field is empty" to the user.

// 6. Do not expose internal database/context terminology such as:
//    "database context", "samples field", "testRequests field", etc.

// 7. Never invent a SampleID.
//    If sample_id is null, clearly say that the system has not assigned
//    a sample ID yet.

// 8. If sample_id is null, the test request ID may be mentioned as a
//    test request identifier, but DO NOT call it a SampleID.

// 9. For completed and pending tests, use tests_required and completed_tests
//    from the test request.

// 10. Always answer using the logged-in user's data only.

// USER DATABASE CONTEXT:

// ${JSON.stringify(context, null, 2)}
// `;


//     // ===================================================
//     // PREVIOUS CONVERSATION
//     // ===================================================

//     const messages = [

//       {
//         role: 'system',
//         content: systemPrompt
//       }

//     ];


//     // Add previous messages

//     if (Array.isArray(history)) {

//       for (const item of history) {

//         if (
//           item.role &&
//           item.message
//         ) {

//           messages.push({
//             role:
//               item.role === 'assistant'
//                 ? 'assistant'
//                 : 'user',

//             content: item.message
//           });

//         }

//       }

//     }


//     // ===================================================
//     // CURRENT USER MESSAGE
//     // ===================================================

//     messages.push({
//       role: 'user',
//       content: userMessage
//     });


//     // ===================================================
//     // GROQ
//     // ===================================================

//     const completion =
//       await groq.chat.completions.create({

//         model: 'llama-3.3-70b-versatile',

//         messages,

//         temperature: 0.2,

//         max_tokens: 1000

//       });


//     const response =
//       completion.choices[0]?.message?.content;


//     if (!response) {

//       throw new Error(
//         'AI returned an empty response'
//       );

//     }


//     return response.trim();

//   } catch (error) {

//     console.error(
//       "AI SERVICE ERROR:",
//       error
//     );

//     throw error;
//   }
// }


// module.exports = {
//   generateAIResponse
// };














const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


// =====================================================
// GENERATE AI RESPONSE
// =====================================================

async function generateAIResponse(
  userMessage,
  context,
  history = []
) {

  try {

    console.log('================ AI SERVICE ================');

    console.log(
      'User Message:',
      userMessage
    );

    console.log(
      'History Length:',
      history.length
    );


    // ===================================================
    // SYSTEM PROMPT
    // ===================================================

    const systemPrompt = `
You are the AI Assistant for Smart Textile Laboratory.

You help logged-in customers and laboratory staff.

IMPORTANT RULES:

1. Always use the provided user database information.

2. Never invent database information.

3. Never ask for UserID.

4. Never ask for SampleID when the information can be
   identified from the provided context.

5. Always use the currently logged-in user's data.

6. For sample questions, use samples and testRequests.

7. If samples is empty but testRequests contains data,
   treat the test request as a submitted request.

8. If sample_id is null, say that a sample ID has not
   yet been assigned.

9. Never invent sample IDs, barcodes, reports, test results,
   tracking stages, or dates.

10. For test questions, use testsRequired, completedTests,
    and pendingTests when available.

11. For "my sample", "my report", "my tests", "my status",
    or similar questions, use the current user's data.

12. If the requested information is not available,
    clearly say so.

13. Never reveal another user's information.

14. Do not expose SQL, database context, JSON, JWT,
    credentials, or internal implementation details.

15. For general textile questions, use general knowledge.

16. Keep answers short and clear.

IMPORTANT READ-ONLY RULES:

19. You are a READ-ONLY AI Assistant.

20. You must NEVER modify, update, insert, delete, or
    change any database record.

21. You must NEVER claim that you have updated:
    - test status
    - test results
    - sample status
    - reports
    - tracking information
    - test requests
    - user information

22. If the user asks you to perform an action such as:
    - complete a test
    - mark a test as completed
    - update a result
    - change sample status
    - update a report
    - assign a barcode
    - modify tracking status

    you must NOT perform the action.

23. Instead, clearly explain that the AI chat is read-only
    and the requested change must be performed through
    the appropriate laboratory management interface.

24. Never say "I've updated", "I changed", "I completed",
    "I modified", or similar wording unless an actual
    authorized backend operation has been performed.

25. The AI may only READ and explain the information
    provided in the database context.

26. The AI must not generate or execute SQL UPDATE,
    INSERT, DELETE, or other database modification queries.

27. If the user asks to update something, do not pretend
    the update happened.

USER DATA:

${JSON.stringify(context)}
`;


    // ===================================================
    // GROQ MESSAGES
    // ===================================================

    const messages = [

      {
        role: 'system',
        content: systemPrompt
      }

    ];


    // ===================================================
    // ADD LIMITED HISTORY
    // ===================================================

    if (Array.isArray(history)) {

      const recentHistory =
        history.slice(-6);

      for (const item of recentHistory) {

        if (
          item &&
          item.role &&
          item.message
        ) {

          messages.push({

            role:
              item.role === 'assistant'
                ? 'assistant'
                : 'user',

            content:
              String(item.message)

          });

        }

      }

    }


    // ===================================================
    // CURRENT QUESTION
    // ===================================================

    messages.push({

      role: 'user',

      content: userMessage

    });


    console.log(
      'Groq Messages Count:',
      messages.length
    );


    // ===================================================
    // GROQ API
    // ===================================================

    const completion =
      await groq.chat.completions.create({

        model: 'llama-3.1-8b-instant',

        messages,

        temperature: 0.2,

        max_tokens: 300

      });


    // ===================================================
    // GET RESPONSE
    // ===================================================

    const response =
      completion
        .choices?.[0]
        ?.message
        ?.content;


    if (!response) {

      throw new Error(
        'AI returned an empty response'
      );

    }


    console.log(
      'AI Response:',
      response
    );

    console.log(
      '=========================================='
    );


    return response.trim();

  }


  catch (error) {

    console.error(
      '================ AI SERVICE ERROR ================'
    );

    console.error(
      'Error Message:',
      error.message
    );

    console.error(
      'Error Status:',
      error.status
    );


    // =================================================
    // RATE LIMIT
    // =================================================

    if (error.status === 429) {

      throw new Error(
        'AI service rate limit reached. Please try again later.'
      );

    }


    throw error;

  }

}


module.exports = {
  generateAIResponse
};