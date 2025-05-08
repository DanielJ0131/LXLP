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
middleware.jwtTokenIsValid = (req, res, next) => {
  const token = req.header('Authorization') ||
    null

  try {
    res.locals.jwt = jwt.verify(token)
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
