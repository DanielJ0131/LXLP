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
  const authHeader = req.header('Authorization')
  if(!authHeader) {
    return res.status(401).json({
      type: 'failed',
      message: 'No authorization header'
    })
  }
  
  const token = authHeader
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

    res.locals.jwt = jwt.verify(token)
    console.log(token)
    console.log(res.locals.jwt)
  } catch (err) {
    console.error(err)
    err.status = 403
    if (err.name === 'TokenExpiredError') {
      err.status = 401
    }
    throw err
  }

  next()
}
