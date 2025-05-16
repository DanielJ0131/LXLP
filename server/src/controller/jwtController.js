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
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\-_!@#$%^&*])[A-Za-z\d\-_!@#$%^&*]{10,}$/
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
  jwtController.login(req, res)
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

  try {
    const data = await UsersModel.login(username, password)

    res.cookie('accessToken', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 15 // 15 min
    })

    res.status(200).json({
      type: 'success',
      message: 'The user was authenticated',
      token: data.token,
      user: data.user
    })

  } catch (err) {
    res.status(401).json({
      type: 'error',
      message: 'Invalid credentials'
    })
  }
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

/**
 * Logout the user and blacklist the JWT token.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
jwtController.logout = async (req, res) => {
  try{
    const token = req.cookies.accessToken;

    if(!token){
      return res.status(401).json({message:'No token provided in cookie'})
    }
    await jwt.blacklist(token)

    res.clearCookie('accessToken', {
      httpOnly:true,
      secure:process.env.NODE_ENV=== 'production',
      sameSite:'Lax',
      maxAge:0 //probably makes the token delete immidiatly
    })

    res.json({
      type:'success',
      message:'User was logged out and token is blacklisted'
    })

  } catch (error){
    console.log('Logout error', error)
    res.status(500).json({
      type:'error',
      message:error.message ||'Logout failed'
    })
  }
}
