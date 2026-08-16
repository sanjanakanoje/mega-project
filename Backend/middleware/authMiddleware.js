// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {

//   try {

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authorization token missing'
//       });
//     }

//     const token = authHeader.startsWith('Bearer ')
//       ? authHeader.substring(7)
//       : authHeader;

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     /*
//       We support common payload names because
//       your existing login code may use one of them.
//     */

//     const userId =
//       decoded.userId ??
//       decoded.UserID ??
//       decoded.id;

//     const role =
//       decoded.role ??
//       decoded.Role;

//     if (!userId) {

//       return res.status(401).json({
//         success: false,
//         message: 'User ID not found in token'
//       });

//     }

//     req.user = {
//       userId: Number(userId),
//       role: role
//     };

//     next();

//   } catch (error) {

//     console.error(
//       'AUTH MIDDLEWARE ERROR:',
//       error.message
//     );

//     return res.status(401).json({
//       success: false,
//       message: 'Invalid or expired token'
//     });

//   }

// };

// module.exports = authMiddleware;








const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {

  try {

    // =====================================================
    // GET AUTHORIZATION HEADER
    // =====================================================

    const authHeader =
      req.headers.authorization;


    // =====================================================
    // CHECK TOKEN EXISTS
    // =====================================================

    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message:
          'Authorization token missing'

      });

    }


    // =====================================================
    // CHECK BEARER FORMAT
    // Expected:
    // Authorization: Bearer <token>
    // =====================================================

    const parts =
      authHeader.split(' ');


    if (
      parts.length !== 2 ||
      parts[0] !== 'Bearer' ||
      !parts[1]
    ) {

      return res.status(401).json({

        success: false,

        message:
          'Invalid authorization format'

      });

    }


    // =====================================================
    // GET TOKEN
    // =====================================================

    const token =
      parts[1];


    // =====================================================
    // VERIFY JWT
    // =====================================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // =====================================================
    // CHECK USER ID
    // =====================================================

    if (!decoded.id) {

      return res.status(401).json({

        success: false,

        message:
          'Invalid token: user ID missing'

      });

    }


    // =====================================================
    // SAVE AUTHENTICATED USER
    // =====================================================

    req.user = {

      id: decoded.id,

      role: decoded.role

    };


    // =====================================================
    // DEBUG LOG
    // =====================================================

    console.log(
      'Authenticated User:',
      req.user
    );


    // =====================================================
    // CONTINUE
    // =====================================================

    next();


  } catch (error) {

    console.error(
      'AUTH ERROR:',
      error.message
    );


    // =====================================================
    // INVALID / EXPIRED TOKEN
    // =====================================================

    return res.status(401).json({

      success: false,

      message:
        'Invalid or expired token'

    });

  }

}


module.exports = {
  authenticateToken
};