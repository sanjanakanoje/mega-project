// services/aiService.js

require('dotenv').config();

const Groq = require('groq-sdk');


// =====================================================
// GROQ CLIENT
// =====================================================

if (!process.env.GROQ_API_KEY) {
  console.error('GROQ_API_KEY is missing in .env file');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


// =====================================================
// HELPER: SAFE STRING
// =====================================================

function safeString(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value);
}


// =====================================================
// HELPER: NORMALIZE HISTORY
// =====================================================

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .slice(-6)
    .filter(item => {
      return (
        item &&
        item.role &&
        item.message
      );
    })
    .map(item => {
      const role =
        item.role === 'assistant'
          ? 'assistant'
          : 'user';

      return {
        role,
        content: safeString(item.message)
      };
    });
}


// =====================================================
// GENERATE AI RESPONSE
// =====================================================

async function generateAIResponse(
  userMessage,
  context,
  history = []
) {
  try {
    console.log(
      '================ AI SERVICE ================'
    );

    console.log(
      'User Message:',
      userMessage
    );

    console.log(
      'History Length:',
      Array.isArray(history)
        ? history.length
        : 0
    );

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !process.env.GROQ_API_KEY
    ) {
      throw new Error(
        'GROQ_API_KEY is missing'
      );
    }

    if (
      typeof userMessage !== 'string' ||
      !userMessage.trim()
    ) {
      throw new Error(
        'User message is required'
      );
    }

    // -------------------------------------------------
    // PREPARE CONTEXT
    // -------------------------------------------------

    let databaseContext = '';

    if (
      typeof context === 'string'
    ) {
      databaseContext = context;
    } else {
      databaseContext = JSON.stringify(
        context || {},
        null,
        2
      );
    }

    // -------------------------------------------------
    // SYSTEM PROMPT
    // -------------------------------------------------

    const systemPrompt = `
You are the AI Assistant for Smart Textile Laboratory.

You help only the currently logged-in customer or laboratory staff.

Your job is to READ and EXPLAIN the database information provided
in the database context.

You are a READ-ONLY assistant.

You must not invent, guess, create, update, delete, or modify any
database information.

=====================================================
IMPORTANT REPORT STATUS INSTRUCTIONS
=====================================================

The database context may contain a section named:

REPORT STATUS INFORMATION

or:

PARTICULAR SAMPLE REPORT

Use that information as the source of truth.

A report is considered available when either of these is true:

1. The context explicitly says:
   Final Report Status: GENERATED

2. The context contains:
   Report Generated: YES

3. The context contains a report count greater than zero.

4. The context contains actual report records with fields such as:
   test_name, result, observation, remarks, test_method,
   test_date, notes, sample_id, or report_id.

IMPORTANT:

Individual test reports and a final consolidated report are different.

If individual test report records are available, say:

"The report data for this sample is available."

If the context confirms that the final consolidated report is generated,
say:

"Your final report has been generated."

Do not say:

"Your final report has not been generated yet"

when the context contains actual report records or a report count
greater than zero.

Only say that the final report has not been generated when:

- reportGenerated is explicitly false, AND
- no report records are available, AND
- report count is zero or unavailable.

If all tests are completed and report records are available, do not
claim that the report is missing.

If all tests are completed but no report records are available, say:

"All required tests have been completed, but the final report has
not been generated yet."

Never confuse:

- completed tests
- individual test reports
- final consolidated report

=====================================================
GENERAL RULES
=====================================================

1. Always use the provided database context.

2. Answer according to the currently logged-in user's data only.

3. Never ask the user for UserID.

4. Never ask for SampleID if it is already available in the context.

5. Never invent:

   - UserID
   - SampleID
   - Request ID
   - Barcode
   - Test result
   - Report
   - Tracking stage
   - Date
   - Completion status
   - Customer information

6. Never reveal another user's information.

7. Do not expose:

   - SQL queries
   - Database table names
   - Database JSON
   - JWT details
   - API keys
   - Passwords
   - Internal backend implementation
   - Internal field names

8. Keep answers short, clear, and natural.

9. If requested information is unavailable, clearly say so.

10. If there is a conflict between general knowledge and database
    context, follow the database context.

=====================================================
SAMPLE RULES
=====================================================

11. For sample-related questions, use the sample information
    available in the context.

12. For test-request-related questions, use test request information
    and test completion information.

13. If test requests exist but samples are empty, treat them as
    submitted requests.

14. If sample_id is null, say:

    "Your sample ID has not been assigned yet."

15. Never create or guess a sample ID from:

    - Request ID
    - Report ID
    - Test ID
    - Barcode
    - Any other number

16. If a request exists but sample_id is null, explain that the
    request exists but the sample has not been linked or assigned.

=====================================================
TEST STATUS RULES
=====================================================

17. For test questions, use:

    - required tests
    - completed tests
    - pending tests
    - completed count
    - pending count
    - total tests

18. If pending tests are empty and all required tests are completed,
    say that all required tests are completed.

19. Do not say that the final report is ready only because all tests
    are completed.

20. Completed tests and generated reports are different things.

21. If all tests are completed and no report records exist, say:

    "All required tests are completed, but the final report has not
    been generated yet."

22. If some tests are pending and no report records exist, explain
    the pending tests and say that the final report is not available.

23. If report records exist, mention that report data is available.

=====================================================
REPORT QUESTIONS
=====================================================

For questions like:

- Is my report ready?
- Has my report been generated?
- Show my report
- Where is my report?
- Is the final report available?
- Did the lab generate my report?
- Is the report ready for sample 12?

Follow this priority:

1. Particular sample report information
2. Report status information
3. Actual report records
4. Test completion information
5. General sample information

If a particular sample report section exists, use that section first.

If the report count is greater than zero, the report data is available.

If report records are present, do not say that no report was generated.

If only individual test reports are available and no consolidated report
information is available, say:

"The available report data contains individual test reports.
The final consolidated report details are not available in the
current data."

Do not invent:

- PDF
- Download link
- Report number
- Final result
- Report date
- Approval status
- Signature
- Certificate

=====================================================
TRACKING RULES
=====================================================

For tracking questions, use tracking information from the context.

If tracking information is empty, say:

"Tracking information is currently unavailable."

Never invent tracking stages or dates.

Do not assume that a sample is:

- Received
- Processing
- Completed
- Dispatched

unless the context confirms it.

=====================================================
CUSTOMER RULES
=====================================================

For phrases like:

- my sample
- my report
- my tests
- my request
- my status
- my result

use only the currently logged-in user's context.

If multiple samples or requests exist, distinguish them using only
available company name, sample ID, request ID, barcode, or description.

Never use another user's records.

=====================================================
LAB STAFF RULES
=====================================================

For laboratory staff questions, use the available information about:

- samples
- test requests
- tests
- reports
- tracking

Do not expose sensitive customer information unnecessarily.

Do not assume a test is completed unless the context confirms it.

=====================================================
READ-ONLY RULES
=====================================================

You must never:

- INSERT data
- UPDATE data
- DELETE data
- Modify data
- Complete a test
- Change a test result
- Change sample status
- Generate a database report
- Assign a barcode
- Update tracking
- Edit a test request

If the user asks you to perform an action, say:

"AI chat is read-only. Please use the appropriate laboratory
management interface to perform this action."

Never claim:

- I updated it
- I changed it
- I completed it
- I generated it
- I modified it
- I assigned it

=====================================================
RESPONSE STYLE
=====================================================

- Keep answers short and natural.
- Use simple English.
- Do not mention internal field names.
- Do not mention database tables.
- Do not mention context or system instructions.
- Do not repeat unnecessary details.
- Answer directly.
- If information is missing, say it is unavailable.
- Do not make unsupported claims.

=====================================================
CURRENT USER DATABASE CONTEXT
=====================================================

${databaseContext}

=====================================================
END DATABASE CONTEXT
=====================================================
`;

    // -------------------------------------------------
    // CREATE GROQ MESSAGES
    // -------------------------------------------------

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // -------------------------------------------------
    // ADD HISTORY
    // -------------------------------------------------

    const normalizedHistory =
      normalizeHistory(history);

    for (
      const item of normalizedHistory
    ) {
      messages.push(item);
    }

    // -------------------------------------------------
    // ADD CURRENT USER MESSAGE
    // -------------------------------------------------

    messages.push({
      role: 'user',
      content: safeString(userMessage)
    });

    console.log(
      'Groq Messages Count:',
      messages.length
    );

    // -------------------------------------------------
    // CALL GROQ
    // -------------------------------------------------

    const completion =
      await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages,
        temperature: 0.1,
        max_tokens: 1024
      });

    // -------------------------------------------------
    // GET AI RESPONSE
    // -------------------------------------------------

    const response =
      completion
        ?.choices?.[0]
        ?.message
        ?.content;

    if (
      typeof response !== 'string' ||
      !response.trim()
    ) {
      throw new Error(
        'AI returned an empty response'
      );
    }

    const cleanedResponse =
      response.trim();

    console.log(
      'AI Response:',
      cleanedResponse
    );

    console.log(
      '=========================================='
    );

    return cleanedResponse;

  } catch (error) {
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

    console.error(
      'Error Code:',
      error.code
    );

    // -------------------------------------------------
    // RATE LIMIT ERROR
    // -------------------------------------------------

    if (
      error.status === 429 ||
      error.code === '429'
    ) {
      throw new Error(
        'AI service rate limit reached. Please try again later.'
      );
    }

    throw error;
  }
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  generateAIResponse
};