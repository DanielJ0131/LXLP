import jwt from 'jsonwebtoken'

const model = {}
export default model

/**
 * Generate a JWT token.
 *
 * @param {string} username Username of the user.
 * @param role
 * @param email
 * @returns {object} Details on the user.
 */
model.createJwtToken = (username, role, email) => {
  const payload = {
    iss: 'Issuer id',
    sub: username,
    username,
    email,
    role,
    permissions: ['read', 'write'],
    iat: Date.now()
  }
  const options = {
    expiresIn: '1h'
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, options)
  return token
}

/**
 * Decode to extract the payload of the JWT token.
 *
 * @param {string} token JWT token.
 * @returns {object} Details saved in the token.
 */
model.decode = (token) => {
  return jwt.decode(token)
}

/**
 * Verify the JWT token and its signature.
 *
 * @param {string} token JWT token.
 * @returns {object} The content of the verified token.
 */
model.verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
