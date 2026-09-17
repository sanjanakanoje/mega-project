
// const pool = require('../config/db');


// // ==========================================
// // ADD / UPDATE REPORT
// // ==========================================
// exports.addReport = async (req, res) => {
//     try {

//         const {
//             sample_id,
//             test_name,
//             test_method,
//             test_date,
//             result,
//             observation,
//             remarks,
//             notes,
//             created_by
//         } = req.body;


//         // ==========================================
//         // VALIDATION
//         // ==========================================

//         if (!sample_id) {
//             return res.status(400).json({
//                 message: 'Sample ID is required'
//             });
//         }

//         if (!test_name) {
//             return res.status(400).json({
//                 message: 'Test name is required'
//             });
//         }


//         // ==========================================
//         // CHECK EXISTING REPORT
//         // ==========================================

//         const existingReport = await pool.query(
//             `
//             SELECT id
//             FROM test_reports
//             WHERE sample_id = $1
//             AND test_name = $2
//             `,
//             [
//                 sample_id,
//                 test_name
//             ]
//         );


//         console.log('REPORT DATA RECEIVED:', {
//             sample_id,
//             test_name,
//             test_method,
//             test_date,
//             result,
//             observation,
//             remarks,
//             notes,
//             created_by
//         });


//         console.log(
//             'EXISTING REPORT:',
//             existingReport.rows
//         );


//         let resultData;


//         // ==========================================
//         // UPDATE EXISTING REPORT
//         // ==========================================

//         if (existingReport.rows.length > 0) {

//             resultData = await pool.query(
//                 `
//                 UPDATE test_reports
//                 SET
//                     test_method = $1,
//                     test_date = $2,
//                     result = $3,
//                     observation = $4,
//                     remarks = $5,
//                     notes = $6,
//                     created_by = $7,
//                     updated_at = CURRENT_TIMESTAMP
//                 WHERE sample_id = $8
//                 AND test_name = $9
//                 RETURNING *
//                 `,
//                 [
//                     test_method || '',
//                     test_date || null,
//                     result || '',
//                     observation || '',
//                     remarks || '',
//                     notes || '',
//                     created_by || null,
//                     sample_id,
//                     test_name
//                 ]
//             );

//         }


//         // ==========================================
//         // INSERT NEW REPORT
//         // ==========================================

//         else {

//             resultData = await pool.query(
//                 `
//                 INSERT INTO test_reports
//                 (
//                     sample_id,
//                     test_name,
//                     test_method,
//                     test_date,
//                     result,
//                     observation,
//                     remarks,
//                     notes,
//                     created_by
//                 )
//                 VALUES
//                 (
//                     $1,
//                     $2,
//                     $3,
//                     $4,
//                     $5,
//                     $6,
//                     $7,
//                     $8,
//                     $9
//                 )
//                 RETURNING *
//                 `,
//                 [
//                     sample_id,
//                     test_name,
//                     test_method || '',
//                     test_date || null,
//                     result || '',
//                     observation || '',
//                     remarks || '',
//                     notes || '',
//                     created_by || null
//                 ]
//             );

//         }


//         // ==========================================
//         // SUCCESS RESPONSE
//         // ==========================================

//         res.status(200).json({
//             message: existingReport.rows.length > 0
//                 ? 'Report updated successfully'
//                 : 'Report saved successfully',

//             report: resultData.rows[0]
//         });


//     } catch (error) {

//         console.error(
//             'Add / Update Report Error:',
//             error
//         );

//         res.status(500).json({
//             message: 'Failed to save report',
//             error: error.message
//         });

//     }
// };



// // ==========================================
// // GET SINGLE REPORT
// // ==========================================
// exports.getReport = async (req, res) => {

//     try {

//         const {
//             sampleId,
//             testName
//         } = req.params;


//         // ==========================================
//         // GET REPORT
//         // ==========================================

//         const result = await pool.query(
//             `
//             SELECT *
//             FROM test_reports
//             WHERE sample_id = $1
//             AND test_name = $2
//             `,
//             [
//                 sampleId,
//                 testName
//             ]
//         );


//         // ==========================================
//         // REPORT NOT FOUND
//         // ==========================================

//         if (result.rows.length === 0) {

//             return res.status(404).json({
//                 message: 'Report not found'
//             });

//         }


//         // ==========================================
//         // REPORT FOUND
//         // ==========================================

//         res.status(200).json(
//             result.rows[0]
//         );


//     } catch (error) {

//         console.error(
//             'Get Report Error:',
//             error
//         );

//         res.status(500).json({
//             message: 'Failed to get report',
//             error: error.message
//         });

//     }

// };



// // ==========================================
// // GET ALL REPORTS OF SAMPLE
// // ==========================================
// exports.getReportsBySample = async (req, res) => {

//     try {

//         const {
//             sampleId
//         } = req.params;


//         // ==========================================
//         // GET ALL REPORTS
//         // ==========================================

//         const result = await pool.query(
//             `
//             SELECT *
//             FROM test_reports
//             WHERE sample_id = $1
//             ORDER BY created_at DESC
//             `,
//             [
//                 sampleId
//             ]
//         );


//         res.status(200).json(
//             result.rows
//         );


//     } catch (error) {

//         console.error(
//             'Get Sample Reports Error:',
//             error
//         );

//         res.status(500).json({
//             message: 'Failed to get reports',
//             error: error.message
//         });

//     }

// };






























const pool = require('../config/db');


// =====================================================
// ADD NEW REPORT / UPDATE EXISTING REPORT
// =====================================================

exports.addReport = async (req, res) => {

    try {

        const {
            id,
            sample_id,
            test_name,
            test_method,
            test_date,
            result,
            observation,
            remarks,
            notes,
            created_by
        } = req.body;


        // =============================================
        // VALIDATION
        // =============================================

        if (!sample_id) {

            return res.status(400).json({
                message: 'Sample ID is required'
            });

        }


        if (!test_name) {

            return res.status(400).json({
                message: 'Test name is required'
            });

        }


        if (!test_method || !test_method.trim()) {

            return res.status(400).json({
                message: 'Test method / standard is required'
            });

        }


        // =============================================
        // UPDATE EXISTING REPORT
        // =============================================

        if (id) {

            const updateResult = await pool.query(
                `
                UPDATE test_reports

                SET
                    test_method = $1,
                    test_date = $2,
                    result = $3,
                    observation = $4,
                    remarks = $5,
                    notes = $6,
                    created_by = $7,
                    updated_at = CURRENT_TIMESTAMP

                WHERE id = $8

                RETURNING *
                `,
                [

                    test_method.trim(),

                    test_date || null,

                    result || '',

                    observation || '',

                    remarks || '',

                    notes || '',

                    created_by || null,

                    id

                ]
            );


            if (
                updateResult.rows.length === 0
            ) {

                return res.status(404).json({
                    message: 'Report not found'
                });

            }


            return res.status(200).json({

                message:
                    'Report updated successfully',

                report:
                    updateResult.rows[0]

            });

        }


        // =============================================
        // INSERT NEW REPORT
        // =============================================

        const insertResult = await pool.query(
            `
            INSERT INTO test_reports
            (
                sample_id,
                test_name,
                test_method,
                test_date,
                result,
                observation,
                remarks,
                notes,
                created_by
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            )

            RETURNING *
            `,
            [

                sample_id,

                test_name,

                test_method.trim(),

                test_date || null,

                result || '',

                observation || '',

                remarks || '',

                notes || '',

                created_by || null

            ]
        );


        return res.status(200).json({

            message:
                'New report saved successfully',

            report:
                insertResult.rows[0]

        });


    } catch (error) {

        console.error(
            'Add / Update Report Error:',
            error
        );


        return res.status(500).json({

            message:
                'Failed to save report',

            error:
                error.message

        });

    }

};



// =====================================================
// GET ALL REPORTS FOR SAME SAMPLE + TEST
// =====================================================

exports.getReportsByTest = async (req, res) => {

    try {

        const {
            sampleId,
            testName
        } = req.params;


        const result = await pool.query(
            `
            SELECT *

            FROM test_reports

            WHERE sample_id = $1
            AND test_name = $2

            ORDER BY created_at ASC
            `,
            [
                sampleId,
                testName
            ]
        );


        return res.status(200).json(
            result.rows
        );


    } catch (error) {

        console.error(
            'Get Reports By Test Error:',
            error
        );


        return res.status(500).json({

            message:
                'Failed to get reports',

            error:
                error.message

        });

    }

};



// =====================================================
// GET SINGLE REPORT BY ID
// =====================================================

exports.getReportById = async (req, res) => {

    try {

        const {
            reportId
        } = req.params;


        const result = await pool.query(
            `
            SELECT *

            FROM test_reports

            WHERE id = $1
            `,
            [
                reportId
            ]
        );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    'Report not found'

            });

        }


        return res.status(200).json(
            result.rows[0]
        );


    } catch (error) {

        console.error(
            'Get Report By ID Error:',
            error
        );


        return res.status(500).json({

            message:
                'Failed to get report',

            error:
                error.message

        });

    }

};



// =====================================================
// OLD GET SINGLE REPORT
// =====================================================

exports.getReport = async (req, res) => {

    try {

        const {
            sampleId,
            testName
        } = req.params;


        const result = await pool.query(
            `
            SELECT *

            FROM test_reports

            WHERE sample_id = $1
            AND test_name = $2

            ORDER BY created_at DESC

            LIMIT 1
            `,
            [
                sampleId,
                testName
            ]
        );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    'Report not found'

            });

        }


        return res.status(200).json(
            result.rows[0]
        );


    } catch (error) {

        console.error(
            'Get Report Error:',
            error
        );


        return res.status(500).json({

            message:
                'Failed to get report',

            error:
                error.message

        });

    }

};



// =====================================================
// GET ALL REPORTS FOR SAMPLE
// =====================================================

exports.getReportsBySample = async (req, res) => {

    try {

        const {
            sampleId
        } = req.params;


        const result = await pool.query(
            `
            SELECT *

            FROM test_reports

            WHERE sample_id = $1

            ORDER BY created_at DESC
            `,
            [
                sampleId
            ]
        );


        return res.status(200).json(
            result.rows
        );


    } catch (error) {

        console.error(
            'Get Sample Reports Error:',
            error
        );


        return res.status(500).json({

            message:
                'Failed to get reports',

            error:
                error.message

        });

    }

};