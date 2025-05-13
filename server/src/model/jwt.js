import jwt from 'jsonwebtoken'
import DatabaseService from '../service/DatabaseService.js'

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
  const currentDate = new Date()
  const payload = {
    iss: 'Issuer id',
    sub: username,
    username,
    email,
    role,
    permissions: ['read', 'write'],
    iat: Date.now(),
    exp: Date.now() + 60 * 60 * 1000 * 24 * 365 // 1 year expiration
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET)
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
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log('Decoded token:', model.decode(token))
    if (err) {
      console.error('Token verification failed:', err)
      return null
    }
    return decoded
  })
}


model.isTokenBlacklisted = async (token) => {
  try {
    const blacklistedToken = await DatabaseService.blacklistedTokens.findOne({ token: token });
    console.log('Blacklisted token:', token);
    return !!blacklistedToken; // Return true if the token is found in the blacklist
  }
  catch (error) {
    console.error('Error checking token blacklist:', error);
    throw new Error('Failed to check token blacklist');
  }
}

/**
 * Add a JWT token to the blacklist.
 *
 * @param {string} token JWT token to be blacklisted.
 * @returns {Promise<void>} Resolves when the token is successfully blacklisted.
 */
model.blacklist = async (token) => {
  try {
    // First verify the token is valid
    const decoded = model.verify(token);
    
    if (!decoded) {
      throw new Error('Invalid token: failed to decode');
    }

    // Create the blacklisted token document
    const blacklistedToken = {
      token: token,
      user: {
        sub: decoded.sub,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role
      },
      permissions: decoded.permissions || [], // Fallback to empty array
      issuedAt: new Date(decoded.iat * 1000), // Convert seconds to milliseconds
      expiresAt: new Date(decoded.exp * 1000), // Convert seconds to milliseconds
      reason: 'logout'
    };

    // Save to database - CORRECTED THIS PART
    const result = await DatabaseService.blacklistedTokens.create(blacklistedToken);
    return result;
    
  } catch (error) {
    console.error('Blacklisting failed:', error.message);
    throw new Error(`Failed to blacklist token: ${error.message}`);
  }
}