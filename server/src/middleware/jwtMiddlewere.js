/**
 * Middleware for JWT token.
 */
import jwt from '../model/jwt.js'
 

const middleware = {}
export { middleware as jwtMiddleware }

/**
 * Verify that the JWT token exists in the request.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @param {object} next Express next object.
 */
middleware.jwtTokenIsValid = async (req, res, next) => {
  const token = req.cookies.accessToken //changed from auth header to cookie

  if (!token) {
    return res.status(401).json({
      type: 'failed',
      message: 'No token provided'
    })
  }

  try {
    const isBlacklisted = await jwt.isTokenBlacklisted(token)
    if (isBlacklisted) {
      return res.status(401).json({
        type: 'failed',
        message: 'The JWT token is blacklisted.'
      })
    }

    const payload = jwt.verify(token)
    res.locals.jwt = payload

    const expirationDate = new Date(payload.exp * 1000)
    if (expirationDate < new Date()) {
      return res.status(401).json({
        type: 'failed',
        message: 'The JWT token is expired.'
      })
    }

    req.user = {
    id: payload.userId,
    role: payload.role     
    };

    next()

  } catch (err) {
    console.error(err)
    return res.status(403).json({
      type: 'error',
      message: 'Invalid or expired token'
    })
  }
}
