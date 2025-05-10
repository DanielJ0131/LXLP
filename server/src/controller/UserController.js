import UserModel from "../model/UsersModel.js";

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
         * Log in a user.
         *
         * @param {Request} req - The request object.
         * @param {Response} res - The response object.
         */
        async loginUser(req, res, next) {
            try {
                const { username, password } = req.body;
        
                const { token, user } = await UserModel.login(username, password);
        
                res.status(200).json({
                    message: 'Login successful',
                    token,
                    user
                });
            } catch (error) {
                res.status(401).json({ error: error.message });
            }
        }


}

export default new UsersController();