/**
 * Controller actions for the JWT.
 */
import jwt from '../model/jwt.js'
import UsersModel from '../model/UsersModel.js'

export const jwtController = {}

/**
 * Init the database table for the users.
 *
 * @async
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */

//jwtController.init = async (req, res) => {
//  await UsersModel.initPasswords()
//  res.json({ message: 'The database was initiated and passwords were populated.' })
//}

/**
 * List all the users.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
jwtController.list = async (req, res) => {
  res.json(await UsersModel.getAllUsers())
}

/**
 * Register a new user.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
jwtController.register = async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const email = req.body.email
  
  // Validate the password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\-_!@#$%^&*])[A-Za-z\d\-_!@#$%^&*]{10,}$/
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      type: 'failed',
      message: 'The password must be at least 10 characters long, contain at least one uppercase letter, one lowercase letter, and one special character (e.g., -, _, or a number).'
    })
  }
  const user = await UsersModel.getUserByUsername(username)

  if (user) {
    return res.status(409).json({
      type: 'failed',
      message: 'The user already exists and can not be registered!'
    })
  }
  const userData = {
    username,
    password,
    firstname,
    lastname,
    email
  }
  await UsersModel.addUser(userData)
  res.json({
    type: 'success',
    message: 'The user was registered.',
    user: {
      username
    }
  })
}

/**
 * Perform a login and generate a JWT.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
jwtController.login = async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  let jwtToken

  try {
    jwtToken = await UsersModel.login(username, password)
  } catch (err) {
    return res.status(401).json({
      type: 'failed',
      message: 'Wrong username or password!'
    })
  }

  res.json({
    type: 'success',
    message: 'The user was authenticated.',
    payload: jwt.decode(jwtToken),
    token: jwtToken
  })
}

/**
 * Get the details in the JWT token.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
jwtController.token = async (req, res) => {
  res.json({
    type: 'success',
    message: 'The JWT token was validated.',
    payload: res.locals.jwt
  })
}
