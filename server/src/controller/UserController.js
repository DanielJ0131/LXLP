import UserModel from "../model/UsersModel.js";
import sendResetEmail from '../service/mailService.js'
import jwt from '../model/jwt.js'



/**
 * Controller to perform CRUD for the users collection.
 *
 * @class
 */
class UsersController {
    /**
     * Get a user by identifier (ID or name).
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getUserById(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await UserModel.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
    
    /**
     * Get a user by name.
     * 
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getUserByName(req, res, next) {
        const name = req.params.name;
        try {
          const user = await UserModel.getUserByName(name);
          
          if (!user) {
            return res.status(404).json({ 
              message: "User not found" 
            });
          }
          
          res.json(user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all users.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getAllUsers(req, res, next) {
        try {
            const users = await UserModel.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Add a new user.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async addUser(req, res, next) {
        try {
            const userData = req.body;
            const newUser = await UserModel.addUser(userData);
            res.status(201).json({
                message: 'User added successfully',
                addedUser: newUser

            });

        } catch (error) {
            if (error.message === 'User already exists') {
                res.status(409).json({ message: 'User already exists' });
            }
            next(error);
            }        
    }

    /**
     * Update an existing user.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async updateUser(req, res, next) {
        const id = req.params.id;
        const userBody = req.body;
        try{
          const currentUser = await UserModel.getUserById(id)
          if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
          }
          const updatedUser = await UserModel.updateUser(id, userBody);
          res.json(updatedUser);
        } catch (error) {
          next(error);
        }
    }

    /**
     * Delete a user.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async deleteUser(req, res, next) {
        const id = req.params.id;
        try {
          const result = await UserModel.getUserById(id);
          if (!result) {
            return res.status(404).json({ message: "User not found" });
          }
          UserModel.deleteUser(id);
          res.status(200).json({ 
            message: "User deleted successfully",
            deletedUser: result
          });
        } catch (error) {
            next(error);
        }
    }


    /**
     * Get a user by email.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getUserByEmail(req, res, next) {
        const email = req.params.email;
        try {
            const user = await UserModel.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }


    /**
     * Get a user by username.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
        async getUserByUsername(req, res, next) {
            const username = req.params.username;
            try {
                const user = await UserModel.getUserByUsername(username);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json(user);
            } catch (error) {
                next(error);
            }
        }



        /**
     * Update Password.

        
    /**
     * Get a user by username.

     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */

    async updatePassword(req, res, next) {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const username = req.body.username;

        // Validate the password
           const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\-_!@#$%^&*])[A-Za-z\d\-_!@#$%^&*]{10,}$/
             if (!passwordRegex.test(newPassword)) {
             return res.status(400).json({
             type: 'failed',
             message: 'The new password must be at least 10 characters long, contain at least one uppercase letter, one lowercase letter, and one special character (e.g., -, _, or a number).'
            })
        }
        try{
           
          const updatedPassword = await UserModel.updatePassword(username, oldPassword, newPassword);
          if (!updatedPassword) {
            return res.status(404).json({ message: "User not found" });
          }
          res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
          next(error);
        }
    }



        async getCurrentUserProfile(req, res, next) {
            try {
                const userId = req.user.id;
                const user = await UserModel.getUserById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json(user);
            } catch (error) {
                next(error);
            }
        }

        //this will not be hardcoded in the final production
        async testMail(req, res) {
        console.log("route called")
        try {
            const token = jwt.createResetToken('patrick.nordahl0033@stud.hkr.se')
            await sendResetEmail('patrick.nordahl0033@stud.hkr.se', token)
            res.status(200).send(" testMail ready")
        } catch (err) {
            console.error(" err in testMail:", err.message)
            res.status(500).send("function failed")
        }
        }

        async resetPassword(req, res, next) {
        const { token, newPassword } = req.body

        // no token no password, big problem
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" })
        }

        // literally copy and paste from ryad, ty
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\-_!@#$%^&*])[A-Za-z\d\-_!@#$%^&*]{10,}$/
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
            message: 'Password must be at least 10 characters and include upper/lowercase, number and special char'
            })
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)

            if (payload.type !== 'reset-password') {
            return res.status(403).json({ message: 'Invalid token type' })
            }

            const user = await UserModel.getUserByEmail(payload.sub)
            if (!user) {
            return res.status(404).json({ message: "User not found" })
            }

            await UserModel.forceUpdatePassword(user.username, newPassword)

            res.status(200).json({ message: "Password reset successful" })

        } catch (err) {
            console.error("Reset error:", err.message)
            res.status(401).json({ message: "Invalid or expired token" })
        }
        }

}

export default new UsersController();