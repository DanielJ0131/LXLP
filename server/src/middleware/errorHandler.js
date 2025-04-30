import http from 'http'

export const errorHandler = {}

/**
 * Default handler for 404 routes when the resource is not found.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @param {Function} next Express next function.
 */
errorHandler.notFoundDefault = (req, res, next) => {
  const err = new Error(http.STATUS_CODES[404] || 'Not Found')
  err.status = 404
  next(err) // Pass the error to the global error handler
}

/**
 * Global error handler.
 *
 * @param {object} err The caught error.
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @param {Function} next Express next function.
 */
errorHandler.errorDefault = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err.stack) // Log the error stack for debugging
  }

  const statusCode = err.status || 500
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong' // Hide error details in production
      : err.message

  const data = {
    status: statusCode,
    message
  }

  if (err.statusDescription) {
    data.statusDescription = err.statusDescription
  } 

  res.status(statusCode).json(data)
}
