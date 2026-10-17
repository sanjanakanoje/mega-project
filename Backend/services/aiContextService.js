// services/aiContextService.js

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
// HELPER: PARSE ARRAY
// =====================================================

function parseTestArray(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  const trimmed = value.trim();

  if (
    !trimmed ||
    trimmed === '[]'
  ) {
    return [];
  }

  // JSON array format
  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed
        .map(item => String(item).trim())
        .filter(Boolean);
    }
  } catch (error) {
    // Continue with other formats
  }

  // PostgreSQL array format
  // {"Test 1","Test 2"}
  if (
    trimmed.startsWith('{') &&
    trimmed.endsWith('}')
  ) {
    const inside = trimmed.substring(
      1,
      trimmed.length - 1
    );

    if (!inside.trim()) {
      return [];
    }

    return inside
      .split(',')
      .map(item => {
        return item
          .trim()
          .replace(/^"(.*)"$/, '$1')
          .replace(/\\"/g, '"')
          .trim();
      })
      .filter(Boolean);
  }

  // Comma-separated string
  if (trimmed.includes(',')) {
    return trimmed
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  // Single test value
  return [trimmed];
}


// =====================================================
// HELPER: NORMALIZE TEST NAME
// =====================================================

function normalizeTestName(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return value
    .toString()
    .trim()
    .toLowerCase();
}


// =====================================================
// HELPER: GET PENDING TESTS
// =====================================================

function getPendingTests(
  requiredTests,
  completedTests
) {
  return requiredTests.filter(requiredTest => {
    return !completedTests.some(completedTest => {
      return (
        normalizeTestName(completedTest) ===
        normalizeTestName(requiredTest)
      );
    });
  });
}


// =====================================================
// HELPER: NORMALIZE SAMPLE ID
// =====================================================

function normalizeSampleId(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const numberValue = Number(value);

  if (
    !Number.isInteger(numberValue) ||
    numberValue <= 0
  ) {
    return null;
  }

  return numberValue;
}


// =====================================================
// HELPER: CREATE REPORT SUMMARY
// =====================================================

function createReportSummary(reports) {
  const reportMap = new Map();

  for (const report of reports) {
    const sampleId = normalizeSampleId(
      report.sample_id
    );

    if (!sampleId) {
      continue;
    }

    if (!reportMap.has(sampleId)) {
      reportMap.set(sampleId, []);
    }

    reportMap
      .get(sampleId)
      .push(report);
  }

  const summary = [];

  for (const [
    sampleId,
    sampleReports
  ] of reportMap.entries()) {
    summary.push({
      sampleId,
      reportGenerated: sampleReports.length > 0,
      reportCount: sampleReports.length,
      reports: sampleReports.map(report => ({
        reportId: report.report_id,
        sampleId: report.sample_id,
        testName: report.test_name,
        testMethod: report.test_method,
        testDate: report.test_date,
        result: report.result,
        observation: report.observation,
        remarks: report.remarks,
        notes: report.notes,
        createdAt: report.created_at,
        updatedAt: report.updated_at
      }))
    });
  }

  return summary;
}


// =====================================================
// HELPER: GET REPORT STATUS FOR SAMPLE
// =====================================================

function getReportStatusForSample(
  reports,
  sampleId
) {
  const numericSampleId =
    normalizeSampleId(sampleId);

  if (!numericSampleId) {
    return {
      sampleId: null,
      reportGenerated: false,
      reportCount: 0,
      reports: []
    };
  }

  const sampleReports = reports.filter(report => {
    return (
      normalizeSampleId(report.sample_id) ===
      numericSampleId
    );
  });

  return {
    sampleId: numericSampleId,
    reportGenerated: sampleReports.length > 0,
    reportCount: sampleReports.length,
    reports: sampleReports
  };
}


// =====================================================
// HELPER: BUILD TEST COMPLETION SUMMARY
// =====================================================

function buildTestCompletionSummary(
  testRequests
) {
  return testRequests.map(request => {
    const requiredTests =
      parseTestArray(
        request.tests_required
      );

    const completedTests =
      parseTestArray(
        request.completed_tests
      );

    const pendingTests =
      getPendingTests(
        requiredTests,
        completedTests
      );

    return {
      requestId: request.id,

      sampleId:
        normalizeSampleId(
          request.sample_id
        ),

      customerId: request.customer_id,

      requestNo: request.request_no,

      companyName: request.company_name,

      sampleDescription:
        request.sample_description,

      totalTests: requiredTests.length,

      completedCount: completedTests.length,

      pendingCount: pendingTests.length,

      requiredTests,

      completedTests,

      pendingTests
    };
  });
}


// =====================================================
// HELPER: BUILD TESTING SUMMARY
// =====================================================

function buildTestingSummary(
  testRequests
) {
  const summary = {
    totalRequests: testRequests.length,
    totalRequiredTests: 0,
    totalCompletedTests: 0,
    totalPendingTests: 0,
    requests: []
  };

  for (const request of testRequests) {
    const requiredTests =
      parseTestArray(
        request.tests_required
      );

    const completedTests =
      parseTestArray(
        request.completed_tests
      );

    const pendingTests =
      getPendingTests(
        requiredTests,
        completedTests
      );

    summary.totalRequiredTests +=
      requiredTests.length;

    summary.totalCompletedTests +=
      completedTests.length;

    summary.totalPendingTests +=
      pendingTests.length;

    summary.requests.push({
      requestId: request.id,

      sampleId:
        normalizeSampleId(
          request.sample_id
        ),

      requestNo: request.request_no,

      companyName: request.company_name,

      sampleDescription:
        request.sample_description,

      styleNo: request.style_no,

      season: request.season,

      fiberContent: request.fiber_content,

      fabricWeight: request.fabric_weight,

      countNo: request.count_no,

      color: request.color,

      construction: request.construction,

      endUse: request.end_use,

      finishType: request.finish_type,

      division: request.division,

      packageType: request.package_type,

      priority: request.priority,

      testsRequired: requiredTests,

      completedTests: completedTests,

      pendingTests: pendingTests,

      createdAt: request.created_at
    });
  }

  return summary;
}


// =====================================================
// GET USER AI CONTEXT
// =====================================================

async function getUserAIContext(
  userId,
  role
) {
  const normalizedRole =
    normalizeRole(role);

  const context = {
    user: null,

    samples: [],

    tracking: [],

    tests: [],

    reports: [],

    reportGenerated: false,

    reportCount: 0,

    reportSummary: [],

    reportStatusBySample: [],

    testRequests: [],

    testCompletionSummary: [],

    sampleSummary: {
      totalSamples: 0,
      totalTestRequests: 0,
      samples: []
    },

    testingSummary: {
      totalRequests: 0,
      totalRequiredTests: 0,
      totalCompletedTests: 0,
      totalPendingTests: 0,
      requests: []
    },

    testSummary: {
      totalPerformed: 0,
      completed: 0,
      pending: 0,
      inProgress: 0
    }
  };

  try {
    console.log('====================================');
    console.log('GENERATING AI CONTEXT');
    console.log('USER ID:', userId);
    console.log('ROLE:', role);
    console.log('NORMALIZED ROLE:', normalizedRole);
    console.log('====================================');


    // =================================================
    // 1. USER INFORMATION
    // =================================================

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

    if (
      userResult.rows.length > 0
    ) {
      context.user =
        userResult.rows[0];
    }


    // =================================================
    // 2. CUSTOMER DATA
    // =================================================

    if (
      normalizedRole === 'customer'
    ) {

      // ===============================================
      // CUSTOMER SAMPLES
      // ===============================================

      const samplesResult =
        await pool.query(
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
          ORDER BY s.datereceived DESC NULLS LAST
          LIMIT 100
          `,
          [userId]
        );

      context.samples =
        samplesResult.rows;


      // ===============================================
      // CUSTOMER TRACKING
      // ===============================================

      const trackingResult =
        await pool.query(
          `
          SELECT
            t.trackingid,
            t.sampleid,
            t.stagename,
            t.updatedat,
            t.updatedby
          FROM tracking t
          INNER JOIN samples s
            ON s.sampleid = t.sampleid
          WHERE s.userid = $1
          ORDER BY t.updatedat DESC NULLS LAST
          LIMIT 500
          `,
          [userId]
        );

      context.tracking =
        trackingResult.rows;


      // ===============================================
      // CUSTOMER TESTS
      // ===============================================

      const testsResult =
        await pool.query(
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

      context.tests =
        testsResult.rows;


      // ===============================================
      // CUSTOMER REPORTS
      // ===============================================

      const reportsResult =
        await pool.query(
          `
          SELECT
            tr.id AS report_id,
            tr.sample_id,
            tr.test_name,
            tr.result,
            tr.observation,
            tr.remarks,
            tr.test_method,
            tr.test_date,
            tr.notes,
            tr.created_by,
            tr.created_at,
            tr.updated_at,

            s.sampletype,
            s.barcode,
            s.status AS sample_status,
            s.datereceived,

            u.name AS customer_name,
            u.email AS customer_email

          FROM test_reports tr

          INNER JOIN samples s
            ON s.sampleid = tr.sample_id

          LEFT JOIN users u
            ON u.userid = s.userid

          WHERE s.userid = $1

          ORDER BY tr.created_at DESC NULLS LAST
          LIMIT 500
          `,
          [userId]
        );

      context.reports =
        reportsResult.rows;


      // ===============================================
      // REPORT STATUS
      // ===============================================

      context.reportCount =
        context.reports.length;

      context.reportGenerated =
        context.reportCount > 0;

      context.reportSummary =
        createReportSummary(
          context.reports
        );

      context.reportStatusBySample =
        context.reportSummary;


      // ===============================================
      // CUSTOMER TEST REQUESTS
      // ===============================================

      const requestsResult =
        await pool.query(
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

          ORDER BY created_at DESC NULLS LAST
          LIMIT 100
          `,
          [userId]
        );

      context.testRequests =
        requestsResult.rows;


      // ===============================================
      // FALLBACK SAMPLE DATA FROM REQUESTS
      // ===============================================

      if (
        context.samples.length === 0 &&
        context.testRequests.length > 0
      ) {
        context.samples =
          context.testRequests.map(request => {
            const requiredTests =
              parseTestArray(
                request.tests_required
              );

            const completedTests =
              parseTestArray(
                request.completed_tests
              );

            const pendingTests =
              getPendingTests(
                requiredTests,
                completedTests
              );

            const sampleId =
              normalizeSampleId(
                request.sample_id
              );

            const reportStatus =
              getReportStatusForSample(
                context.reports,
                sampleId
              );

            return {
              sampleId,

              testRequestId:
                request.id,

              userId:
                request.customer_id,

              sampleType:
                request.sample_description || null,

              barcode: null,

              status:
                pendingTests.length === 0 &&
                requiredTests.length > 0
                  ? 'Completed'
                  : 'In Progress',

              dateReceived:
                request.created_at,

              companyName:
                request.company_name,

              submittedBy:
                request.submitted_by,

              merchantName:
                request.merchant_name,

              brandLabelName:
                request.brand_label_name,

              vendorCode:
                request.vendor_code,

              styleNo:
                request.style_no,

              season:
                request.season,

              fiberContent:
                request.fiber_content,

              fabricWeight:
                request.fabric_weight,

              countNo:
                request.count_no,

              color:
                request.color,

              construction:
                request.construction,

              endUse:
                request.end_use,

              finishType:
                request.finish_type,

              division:
                request.division,

              packageType:
                request.package_type,

              testsRequired:
                requiredTests,

              completedTests:
                completedTests,

              pendingTests:
                pendingTests,

              reportGenerated:
                reportStatus.reportGenerated,

              reportCount:
                reportStatus.reportCount
            };
          });
      }


      // ===============================================
      // SAMPLE SUMMARY
      // ===============================================

      context.sampleSummary = {
        totalSamples:
          context.samples.length,

        totalTestRequests:
          context.testRequests.length,

        samples:
          context.samples.map(sample => {
            const sampleId =
              normalizeSampleId(
                sample.sampleid ??
                sample.sampleId ??
                sample.SampleID
              );

            const reportStatus =
              getReportStatusForSample(
                context.reports,
                sampleId
              );

            return {
              sampleId,

              testRequestId:
                sample.testRequestId ??
                sample.TestRequestID ??
                null,

              status:
                sample.status ??
                sample.Status ??
                null,

              companyName:
                sample.companyname ??
                sample.companyName ??
                sample.CompanyName ??
                null,

              sampleType:
                sample.sampletype ??
                sample.sampleType ??
                sample.SampleType ??
                null,

              barcode:
                sample.barcode ??
                sample.Barcode ??
                null,

              dateReceived:
                sample.datereceived ??
                sample.dateReceived ??
                sample.DateReceived ??
                sample.created_at ??
                null,

              testsRequired:
                parseTestArray(
                  sample.testsrequired ??
                  sample.testsRequired ??
                  sample.TestsRequired
                ),

              completedTests:
                parseTestArray(
                  sample.completedtests ??
                  sample.completedTests ??
                  sample.CompletedTests
                ),

              reportGenerated:
                reportStatus.reportGenerated,

              reportCount:
                reportStatus.reportCount
            };
          })
      };


      // ===============================================
      // TEST COMPLETION SUMMARY
      // ===============================================

      context.testCompletionSummary =
        buildTestCompletionSummary(
          context.testRequests
        );


      // ===============================================
      // TESTING SUMMARY
      // ===============================================

      context.testingSummary =
        buildTestingSummary(
          context.testRequests
        );
    }


    // =================================================
    // 3. LAB STAFF DATA
    // =================================================

    else if (
      normalizedRole === 'labstaff' ||
      normalizedRole === 'lab staff' ||
      normalizedRole === 'lab_staff'
    ) {

      // ===============================================
      // ALL SAMPLES
      // ===============================================

      const samplesResult =
        await pool.query(
          `
          SELECT
            s.sampleid,
            s.userid,
            u.name AS customername,
            u.email AS customeremail,

            s.sampletype,
            s.barcode,
            s.status,
            s.predictedcompletiontime,
            s.datereceived

          FROM samples s

          LEFT JOIN users u
            ON u.userid = s.userid

          ORDER BY s.datereceived DESC NULLS LAST
          LIMIT 200
          `
        );

      context.samples =
        samplesResult.rows;


      // ===============================================
      // ALL TRACKING
      // ===============================================

      const trackingResult =
        await pool.query(
          `
          SELECT
            trackingid,
            sampleid,
            stagename,
            updatedat,
            updatedby
          FROM tracking
          ORDER BY updatedat DESC NULLS LAST
          LIMIT 500
          `
        );

      context.tracking =
        trackingResult.rows;


      // ===============================================
      // ALL TESTS
      // ===============================================

      const testsResult =
        await pool.query(
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

      context.tests =
        testsResult.rows;


      // ===============================================
      // ALL TEST REQUESTS
      // ===============================================

      const requestsResult =
        await pool.query(
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

          ORDER BY created_at DESC NULLS LAST
          LIMIT 200
          `
        );

      context.testRequests =
        requestsResult.rows;


      // ===============================================
      // ALL REPORTS
      // ===============================================

      const reportsResult =
        await pool.query(
          `
          SELECT
            tr.id AS report_id,
            tr.sample_id,
            tr.test_name,
            tr.result,
            tr.observation,
            tr.remarks,
            tr.test_method,
            tr.test_date,
            tr.notes,
            tr.created_by,
            tr.created_at,
            tr.updated_at,

            s.sampletype,
            s.barcode,
            s.status AS sample_status,
            s.userid,

            u.name AS customer_name,
            u.email AS customer_email

          FROM test_reports tr

          LEFT JOIN samples s
            ON s.sampleid = tr.sample_id

          LEFT JOIN users u
            ON u.userid = s.userid

          ORDER BY tr.created_at DESC NULLS LAST
          LIMIT 500
          `
        );

      context.reports =
        reportsResult.rows;


      // ===============================================
      // REPORT STATUS
      // ===============================================

      context.reportCount =
        context.reports.length;

      context.reportGenerated =
        context.reportCount > 0;

      context.reportSummary =
        createReportSummary(
          context.reports
        );

      context.reportStatusBySample =
        context.reportSummary;


      // ===============================================
      // TEST COMPLETION SUMMARY
      // ===============================================

      context.testCompletionSummary =
        buildTestCompletionSummary(
          context.testRequests
        );


      // ===============================================
      // TEST SUMMARY
      // ===============================================

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
        totalPerformed:
          context.tests.length,

        completed:
          completedPerformed.length,

        pending:
          pendingPerformed.length,

        inProgress:
          inProgressPerformed.length
      };


      // ===============================================
      // TESTING SUMMARY
      // ===============================================

      context.testingSummary =
        buildTestingSummary(
          context.testRequests
        );
    }


    // =================================================
    // FINAL DEBUG LOGS
    // =================================================

    console.log('====================================');
    console.log(
      'AI CONTEXT GENERATED SUCCESSFULLY'
    );

    console.log(
      'USER:',
      context.user
    );

    console.log(
      'SAMPLES COUNT:',
      context.samples.length
    );

    console.log(
      'TRACKING COUNT:',
      context.tracking.length
    );

    console.log(
      'TEST COUNT:',
      context.tests.length
    );

    console.log(
      'TEST REQUEST COUNT:',
      context.testRequests.length
    );

    console.log(
      'REPORT COUNT:',
      context.reportCount
    );

    console.log(
      'REPORT GENERATED:',
      context.reportGenerated
    );

    console.log(
      'REPORT STATUS BY SAMPLE:',
      JSON.stringify(
        context.reportStatusBySample,
        null,
        2
      )
    );

    console.log(
      'TEST COMPLETION SUMMARY:',
      JSON.stringify(
        context.testCompletionSummary,
        null,
        2
      )
    );

    console.log('====================================');


    return context;

  } catch (error) {
    console.error('====================================');
    console.error('AI CONTEXT ERROR');
    console.error('MESSAGE:', error.message);
    console.error('CODE:', error.code);
    console.error('STACK:', error.stack);
    console.error('====================================');

    throw error;
  }
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getUserAIContext
};