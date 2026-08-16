// const pool = require('../config/db');

// async function getUserAIContext(userId, role) {

//   const context = {
//     user: null,
//     samples: [],
//     tracking: [],
//     tests: [],
//     reports: [],
//     testRequests: []
//   };

//   // =====================================================
//   // USER INFORMATION
//   // =====================================================

//   const userResult = await pool.query(
//     `
//     SELECT
//       userid,
//       name,
//       email,
//       role
//     FROM users
//     WHERE userid = $1
//     `,
//     [userId]
//   );

//   if (userResult.rows.length > 0) {
//     context.user = userResult.rows[0];
//   }


//   // =====================================================
//   // CUSTOMER DATA
//   // =====================================================

//   if (role && role.toLowerCase() === 'customer') {

//     // ===================================================
//     // USER'S SAMPLES
//     // ===================================================

//     const samplesResult = await pool.query(
//       `
//       SELECT
//         s.sampleid,
//         s.userid,
//         s.sampletype,
//         s.barcode,
//         s.status,
//         s.predictedcompletiontime,
//         s.datereceived
//       FROM samples s
//       WHERE s.userid = $1
//       ORDER BY s.datereceived DESC
//       LIMIT 20
//       `,
//       [userId]
//     );

//     context.samples = samplesResult.rows;


//     // ===================================================
//     // TRACKING
//     // ===================================================

//     const trackingResult = await pool.query(
//       `
//       SELECT
//         t.trackingid,
//         t.sampleid,
//         t.stagename,
//         t.timestamp,
//         t.updatedby
//       FROM tracking t
//       INNER JOIN samples s
//         ON s.sampleid = t.sampleid
//       WHERE s.userid = $1
//       ORDER BY t.timestamp DESC
//       LIMIT 100
//       `,
//       [userId]
//     );

//     context.tracking = trackingResult.rows;


//     // ===================================================
//     // TESTS PERFORMED
//     // ===================================================

//     const testsResult = await pool.query(
//       `
//       SELECT
//         tp.testperformedid,
//         tp.sampleid,
//         tp.testid,
//         tests.testname,
//         tp.result,
//         tp.status
//       FROM testperformed tp
//       INNER JOIN samples s
//         ON s.sampleid = tp.sampleid
//       INNER JOIN tests
//         ON tests.testid = tp.testid
//       WHERE s.userid = $1
//       ORDER BY tp.testperformedid DESC
//       LIMIT 100
//       `,
//       [userId]
//     );

//     context.tests = testsResult.rows;


//     // ===================================================
//     // REPORTS
//     // ===================================================

//     const reportsResult = await pool.query(
//       `
//       SELECT
//         r.reportid,
//         r.sampleid,
//         r.reportdate,
//         r.finalresult
//       FROM reports r
//       INNER JOIN samples s
//         ON s.sampleid = r.sampleid
//       WHERE s.userid = $1
//       ORDER BY r.reportdate DESC
//       LIMIT 50
//       `,
//       [userId]
//     );

//     context.reports = reportsResult.rows;


//     // ===================================================
//     // TEST REQUESTS
//     // ===================================================

//     const requestsResult = await pool.query(
//       `
//       SELECT
//         id,
//         sample_id,
//         customer_id,
//         request_no,
//         company_name,
//         submitted_by,
//         merchant_name,
//         brand_label_name,
//         vendor_code,
//         email,
//         phone_no,
//         sample_description,
//         style_no,
//         season,
//         fiber_content,
//         fabric_weight,
//         count_no,
//         color,
//         construction,
//         end_use,
//         fabric_report_no,
//         trim_fabric_report_no,
//         previous_test_report_no,
//         bo_no,
//         co_no,
//         finish_type,
//         division,
//         package_type,
//         tests_required,
//         wash_instruction,
//         wash_code,
//         priority,
//         created_at
//       FROM test_requests
//       WHERE customer_id = $1
//       ORDER BY created_at DESC
//       LIMIT 20
//       `,
//       [userId]
//     );

//     context.testRequests = requestsResult.rows;


//     // ===================================================
// // REQUESTED TEST SUMMARY
// // ===================================================

// let requestedTests = [];

// for (const request of context.testRequests) {

//   const testsRequired = request.tests_required;

//   if (Array.isArray(testsRequired)) {
//     requestedTests.push(...testsRequired);
//   }

// }

// context.requestedTestSummary = {
//   totalRequested: requestedTests.length,
//   tests: requestedTests
// };
//   }


//   // =====================================================
//   // LAB STAFF DATA
//   // =====================================================

//   else if (
//     role &&
//     (
//       role.toLowerCase() === 'labstaff' ||
//       role.toLowerCase() === 'lab staff' ||
//       role.toLowerCase() === 'lab_staff'
//     )
//   ) {

//     // ===================================================
//     // ALL SAMPLES
//     // ===================================================

//     const samplesResult = await pool.query(
//       `
//       SELECT
//         s.sampleid,
//         s.userid,
//         u.name AS customername,
//         s.sampletype,
//         s.barcode,
//         s.status,
//         s.predictedcompletiontime,
//         s.datereceived
//       FROM samples s
//       LEFT JOIN users u
//         ON u.userid = s.userid
//       ORDER BY s.datereceived DESC
//       LIMIT 50
//       `
//     );

//     context.samples = samplesResult.rows;


//     // ===================================================
//     // ALL TRACKING
//     // ===================================================

//     const trackingResult = await pool.query(
//       `
//       SELECT
//         t.trackingid,
//         t.sampleid,
//         t.stagename,
//         t.timestamp,
//         t.updatedby
//       FROM tracking t
//       ORDER BY t.timestamp DESC
//       LIMIT 200
//       `
//     );

//     context.tracking = trackingResult.rows;


//     // ===================================================
//     // ALL TESTS
//     // ===================================================

//     const testsResult = await pool.query(
//       `
//       SELECT
//         tp.testperformedid,
//         tp.sampleid,
//         tp.testid,
//         tests.testname,
//         tp.result,
//         tp.status
//       FROM testperformed tp
//       INNER JOIN tests
//         ON tests.testid = tp.testid
//       ORDER BY tp.testperformedid DESC
//       LIMIT 200
//       `
//     );

//     context.tests = testsResult.rows;


//     // ===================================================
// // TEST SUMMARY
// // ===================================================

// const completedTests = context.tests.filter(test =>
//   test.status &&
//   test.status.toLowerCase() === 'completed'
// );

// const pendingTests = context.tests.filter(test =>
//   test.status &&
//   test.status.toLowerCase() === 'pending'
// );

// const inProgressTests = context.tests.filter(test =>
//   test.status &&
//   (
//     test.status.toLowerCase() === 'in progress' ||
//     test.status.toLowerCase() === 'in-progress' ||
//     test.status.toLowerCase() === 'processing'
//   )
// );

// context.testSummary = {
//   totalPerformed: context.tests.length,
//   completed: completedTests.length,
//   pending: pendingTests.length,
//   inProgress: inProgressTests.length
// };


//     // ===================================================
//     // ALL REPORTS
//     // ===================================================

//     const reportsResult = await pool.query(
//       `
//       SELECT
//         reportid,
//         sampleid,
//         reportdate,
//         finalresult
//       FROM reports
//       ORDER BY reportdate DESC
//       LIMIT 100
//       `
//     );

//     context.reports = reportsResult.rows;
//   }


//   return context;
// }


// module.exports = {
//   getUserAIContext
// };







const pool = require('../config/db');


// =====================================================
// HELPER: NORMALIZE ROLE
// =====================================================

function normalizeRole(role) {

  if (!role) {
    return '';
  }

  return role
    .toString()
    .trim()
    .toLowerCase();

}


// =====================================================
// HELPER: PARSE TEST ARRAY
// Handles:
// 1. PostgreSQL JSONB array
// 2. JSON stored as TEXT
// 3. PostgreSQL array-like strings
// =====================================================

function parseTestArray(value) {

  if (!value) {
    return [];
  }


  // Already an array
  if (Array.isArray(value)) {
    return value;
  }


  // String value
  if (typeof value === 'string') {

    const trimmed = value.trim();

    if (!trimmed || trimmed === '[]') {
      return [];
    }


    // -----------------------------------------------
    // Try JSON
    // -----------------------------------------------

    try {

      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed;
      }

    } catch (error) {

      // Continue to PostgreSQL-style parsing
    }


    // -----------------------------------------------
    // PostgreSQL array format
    // Example:
    // {"Test 1","Test 2"}
    // -----------------------------------------------

    if (
      trimmed.startsWith('{') &&
      trimmed.endsWith('}')
    ) {

      const inside = trimmed.substring(
        1,
        trimmed.length - 1
      );

      if (!inside) {
        return [];
      }

      return inside
        .split(',')
        .map(item =>
          item
            .trim()
            .replace(/^"(.*)"$/, '$1')
        )
        .filter(Boolean);
    }

  }


  return [];

}


// =====================================================
// GET AI CONTEXT FOR LOGGED-IN USER
// =====================================================

async function getUserAIContext(userId, role) {

  const normalizedRole = normalizeRole(role);


  const context = {
    user: null,
    samples: [],
    tracking: [],
    tests: [],
    reports: [],
    testRequests: [],
    sampleSummary: {
      totalSamples: 0,
      totalTestRequests: 0,
      samples: []
    }
  };

  try {

    console.log('====================================');
    console.log('GENERATING AI CONTEXT');
    console.log('USER ID:', userId);
    console.log('ROLE:', role);
    console.log('NORMALIZED ROLE:', normalizedRole);
    console.log('====================================');


    // =====================================================
    // 1. USER INFORMATION
    // =====================================================

    const userResult = await pool.query(
      `
      SELECT
        userid,
        name,
        email,
        role
      FROM users
      WHERE userid = $1
      `,
      [userId]
    );


    if (userResult.rows.length > 0) {

      context.user = userResult.rows[0];

    }


    // =====================================================
    // 2. CUSTOMER DATA
    // =====================================================

    if (normalizedRole === 'customer') {


      // ===================================================
      // CUSTOMER SAMPLES
      // ===================================================

      const samplesResult = await pool.query(
        `
        SELECT
          s.sampleid,
          s.userid,
          s.sampletype,
          s.barcode,
          s.status,
          s.predictedcompletiontime,
          s.datereceived
        FROM samples s
        WHERE s.userid = $1
        ORDER BY s.datereceived DESC
        LIMIT 100
        `,
        [userId]
      );


      context.samples = samplesResult.rows;


      // ===================================================
      // CUSTOMER TRACKING
      // ===================================================

      const trackingResult = await pool.query(
        `
        SELECT
          t.trackingid,
          t.sampleid,
          t.stagename,
          t.timestamp,
          t.updatedby
        FROM tracking t

        INNER JOIN samples s
          ON s.sampleid = t.sampleid

        WHERE s.userid = $1

        ORDER BY t.timestamp DESC

        LIMIT 500
        `,
        [userId]
      );


      context.tracking = trackingResult.rows;


      // ===================================================
      // TESTS PERFORMED
      // ===================================================

      const testsResult = await pool.query(
        `
        SELECT
          tp.testperformedid,
          tp.sampleid,
          tp.testid,
          tests.testname,
          tp.result,
          tp.status

        FROM testperformed tp

        INNER JOIN samples s
          ON s.sampleid = tp.sampleid

        INNER JOIN tests
          ON tests.testid = tp.testid

        WHERE s.userid = $1

        ORDER BY tp.testperformedid DESC

        LIMIT 500
        `,
        [userId]
      );


      context.tests = testsResult.rows;


      // ===================================================
      // REPORTS
      // ===================================================

      const reportsResult = await pool.query(
        `
        SELECT
          r.reportid,
          r.sampleid,
          r.reportdate,
          r.finalresult

        FROM reports r

        INNER JOIN samples s
          ON s.sampleid = r.sampleid

        WHERE s.userid = $1

        ORDER BY r.reportdate DESC

        LIMIT 200
        `,
        [userId]
      );


      context.reports = reportsResult.rows;


      // ===================================================
      // TEST REQUESTS
      // ===================================================

      const requestsResult = await pool.query(
        `
        SELECT

          id,

          sample_id,

          customer_id,

          request_no,

          company_name,

          submitted_by,

          merchant_name,

          brand_label_name,

          vendor_code,

          email,

          phone_no,

          sample_description,

          style_no,

          season,

          fiber_content,

          fabric_weight,

          count_no,

          color,

          construction,

          end_use,

          fabric_report_no,

          trim_fabric_report_no,

          previous_test_report_no,

          bo_no,

          co_no,

          finish_type,

          division,

          package_type,

          tests_required,

          completed_tests,

          wash_instruction,

          wash_code,

          priority,

          created_at

        FROM test_requests

        WHERE customer_id = $1

        ORDER BY created_at DESC

        LIMIT 50
        `,
        [userId]
      );


      context.testRequests = requestsResult.rows;

      // =====================================================
      // FALLBACK SAMPLE INFORMATION FROM TEST REQUESTS
      // =====================================================

      if (
        context.samples.length === 0 &&
        context.testRequests.length > 0
      ) {

        context.samples = context.testRequests.map(request => ({
          SampleID: request.sample_id || null,

          // Test request ID can be used to identify the submitted request
          TestRequestID: request.id,

          UserID: request.customer_id,

          SampleType: request.sample_description || null,

          Barcode: null,

          Status:
            request.completed_tests &&
            request.tests_required &&
            request.completed_tests.length === request.tests_required.length
              ? 'Completed'
              : 'In Progress',

          DateReceived: request.created_at,

          CompanyName: request.company_name,

          BrandLabelName: request.brand_label_name,

          VendorCode: request.vendor_code,

          StyleNo: request.style_no,

          Season: request.season,

          FiberContent: request.fiber_content,

          FabricWeight: request.fabric_weight,

          Color: request.color,

          Construction: request.construction,

          FinishType: request.finish_type,

          TestsRequired: request.tests_required,

          CompletedTests: request.completed_tests

        }));

      }


      // =====================================================
      // SAMPLE SUMMARY
      // =====================================================

      context.sampleSummary = {
        totalSamples: context.samples.length,

        totalTestRequests: context.testRequests.length,

        samples: context.samples.map(sample => ({
          sampleId: sample.SampleID,
          testRequestId: sample.TestRequestID,
          status: sample.Status,
          companyName: sample.CompanyName,
          sampleType: sample.SampleType,
          barcode: sample.Barcode,
          dateReceived: sample.DateReceived,

          testsRequired: sample.TestsRequired || [],
          completedTests: sample.CompletedTests || []
        }))
      };


      // =====================================================
      // DERIVED CUSTOMER TESTING SUMMARY
      // =====================================================

      context.testingSummary = {
        totalRequests: context.testRequests.length,
        totalRequiredTests: 0,
        totalCompletedTests: 0,
        totalPendingTests: 0,
        requests: []
      };

      for (const request of context.testRequests) {

        let requiredTests = request.tests_required || [];
        let completedTests = request.completed_tests || [];

        // PostgreSQL JSONB / text handling
        if (typeof requiredTests === 'string') {
          try {
            requiredTests = JSON.parse(requiredTests);
          } catch {
            requiredTests = [];
          }
        }

        if (typeof completedTests === 'string') {

          try {
            completedTests = JSON.parse(completedTests);
          } catch {

            // Handle PostgreSQL array-like text if required
            completedTests = completedTests
              .replace(/^\{|\}$/g, '')
              .split(',')
              .map(x => x.trim())
              .filter(Boolean);
          }
        }

        if (!Array.isArray(requiredTests)) {
          requiredTests = [];
        }

        if (!Array.isArray(completedTests)) {
          completedTests = [];
        }

        const pendingTests = requiredTests.filter(
          test => !completedTests.includes(test)
        );

        context.testingSummary.totalRequiredTests +=
          requiredTests.length;

        context.testingSummary.totalCompletedTests +=
          completedTests.length;

        context.testingSummary.totalPendingTests +=
          pendingTests.length;

        context.testingSummary.requests.push({

          requestId: request.id,

          sampleId: request.sample_id,

          companyName: request.company_name,

          sampleDescription: request.sample_description,

          styleNo: request.style_no,

          season: request.season,

          fiberContent: request.fiber_content,

          fabricWeight: request.fabric_weight,

          color: request.color,

          construction: request.construction,

          priority: request.priority,

          testsRequired: requiredTests,

          completedTests: completedTests,

          pendingTests: pendingTests,

          createdAt: request.created_at

        });
      }


      // ===================================================
      // TEST COMPLETION SUMMARY
      // ===================================================

      context.testCompletionSummary = [];


      for (const request of context.testRequests) {


        // -----------------------------------------------
        // REQUIRED TESTS
        // -----------------------------------------------

        const requiredTests =
          parseTestArray(request.tests_required);


        // -----------------------------------------------
        // COMPLETED TESTS
        // -----------------------------------------------

        const completedTests =
          parseTestArray(request.completed_tests);


        // -----------------------------------------------
        // FIND PENDING TESTS
        // -----------------------------------------------

        const pendingTests =
          requiredTests.filter(requiredTest => {

            return !completedTests.some(
              completedTest =>
                completedTest
                  .toString()
                  .trim()
                  .toLowerCase() ===
                requiredTest
                  .toString()
                  .trim()
                  .toLowerCase()
            );

          });


        // -----------------------------------------------
        // SUMMARY
        // -----------------------------------------------

        const summary = {

          requestId: request.id,

          sampleId: request.sample_id,

          companyName: request.company_name,

          totalTests: requiredTests.length,

          completedCount: completedTests.length,

          pendingCount: pendingTests.length,

          requiredTests: requiredTests,

          completedTests: completedTests,

          pendingTests: pendingTests

        };


        context.testCompletionSummary.push(summary);


        console.log(
          'TEST COMPLETION SUMMARY:',
          JSON.stringify(summary, null, 2)
        );

      }


    }


    // =====================================================
    // 3. LAB STAFF DATA
    // =====================================================

    else if (
      normalizedRole === 'labstaff' ||
      normalizedRole === 'lab staff' ||
      normalizedRole === 'lab_staff'
    ) {


      // ===================================================
      // ALL SAMPLES
      // ===================================================

      const samplesResult = await pool.query(
        `
        SELECT

          s.sampleid,

          s.userid,

          u.name AS customername,

          s.sampletype,

          s.barcode,

          s.status,

          s.predictedcompletiontime,

          s.datereceived

        FROM samples s

        LEFT JOIN users u
          ON u.userid = s.userid

        ORDER BY s.datereceived DESC

        LIMIT 200
        `
      );


      context.samples = samplesResult.rows;


      // ===================================================
      // ALL TRACKING
      // ===================================================

      const trackingResult = await pool.query(
        `
        SELECT

          trackingid,

          sampleid,

          stagename,

          timestamp,

          updatedby

        FROM tracking

        ORDER BY timestamp DESC

        LIMIT 500
        `
      );


      context.tracking = trackingResult.rows;


      // ===================================================
      // ALL TESTS PERFORMED
      // ===================================================

      const testsResult = await pool.query(
        `
        SELECT

          tp.testperformedid,

          tp.sampleid,

          tp.testid,

          tests.testname,

          tp.result,

          tp.status

        FROM testperformed tp

        INNER JOIN tests
          ON tests.testid = tp.testid

        ORDER BY tp.testperformedid DESC

        LIMIT 500
        `
      );


      context.tests = testsResult.rows;


      // ===================================================
      // TEST REQUESTS FOR LAB STAFF
      // ===================================================

      const requestsResult = await pool.query(
        `
        SELECT

          id,

          sample_id,

          customer_id,

          request_no,

          company_name,

          submitted_by,

          merchant_name,

          brand_label_name,

          vendor_code,

          email,

          phone_no,

          sample_description,

          style_no,

          season,

          fiber_content,

          fabric_weight,

          count_no,

          color,

          construction,

          end_use,

          fabric_report_no,

          trim_fabric_report_no,

          previous_test_report_no,

          bo_no,

          co_no,

          finish_type,

          division,

          package_type,

          tests_required,

          completed_tests,

          wash_instruction,

          wash_code,

          priority,

          created_at

        FROM test_requests

        ORDER BY created_at DESC

        LIMIT 200
        `
      );


      context.testRequests = requestsResult.rows;


      // ===================================================
      // LAB STAFF TEST COMPLETION SUMMARY
      // ===================================================

      context.testCompletionSummary = [];


      for (const request of context.testRequests) {


        const requiredTests =
          parseTestArray(request.tests_required);


        const completedTests =
          parseTestArray(request.completed_tests);


        const pendingTests =
          requiredTests.filter(requiredTest => {

            return !completedTests.some(
              completedTest =>
                completedTest
                  .toString()
                  .trim()
                  .toLowerCase() ===
                requiredTest
                  .toString()
                  .trim()
                  .toLowerCase()
            );

          });


        context.testCompletionSummary.push({

          requestId: request.id,

          sampleId: request.sample_id,

          customerId: request.customer_id,

          companyName: request.company_name,

          totalTests: requiredTests.length,

          completedCount: completedTests.length,

          pendingCount: pendingTests.length,

          requiredTests: requiredTests,

          completedTests: completedTests,

          pendingTests: pendingTests

        });

      }


      // ===================================================
      // REPORTS
      // ===================================================

      const reportsResult = await pool.query(
        `
        SELECT

          reportid,

          sampleid,

          reportdate,

          finalresult

        FROM reports

        ORDER BY reportdate DESC

        LIMIT 200
        `
      );


      context.reports = reportsResult.rows;


      // ===================================================
      // LAB STAFF TEST SUMMARY
      // ===================================================

      const completedPerformed =
        context.tests.filter(test => {

          return (
            test.status &&
            test.status
              .toString()
              .trim()
              .toLowerCase() === 'completed'
          );

        });


      const pendingPerformed =
        context.tests.filter(test => {

          return (
            test.status &&
            test.status
              .toString()
              .trim()
              .toLowerCase() === 'pending'
          );

        });


      const inProgressPerformed =
        context.tests.filter(test => {

          if (!test.status) {
            return false;
          }

          const status =
            test.status
              .toString()
              .trim()
              .toLowerCase();

          return (
            status === 'in progress' ||
            status === 'in-progress' ||
            status === 'processing'
          );

        });


      context.testSummary = {

        totalPerformed: context.tests.length,

        completed: completedPerformed.length,

        pending: pendingPerformed.length,

        inProgress: inProgressPerformed.length

      };

    }


    // =====================================================
    // DEBUG INFORMATION
    // =====================================================

    console.log(
      '===================================='
    );

    console.log(
      'AI CONTEXT GENERATED SUCCESSFULLY'
    );

    console.log(
      'USER:',
      context.user
    );

    console.log(
      'SAMPLES:',
      context.samples.length
    );

    console.log(
      'TEST PERFORMED:',
      context.tests.length
    );

    console.log(
      'TEST REQUESTS:',
      context.testRequests.length
    );

    console.log(
      'TEST COMPLETION SUMMARY:',
      JSON.stringify(
        context.testCompletionSummary,
        null,
        2
      )
    );

    console.log(
      '===================================='
    );


    return context;


  } catch (error) {


    console.error(
      'AI CONTEXT ERROR:',
      error
    );


    throw error;

  }

}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getUserAIContext
};