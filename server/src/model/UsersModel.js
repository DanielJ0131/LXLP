import DatabaseService from '../service/DatabaseService.js'
import bcrypt from 'bcrypt'
import jwt from './jwt.js'



/**
 * The UsersModel class provides methods to interact with the users data in the database.
 */
class UsersModel{




    async #hasPassword(plaintext) {
        const saltRounds = 10
        return await bcrypt.hash(plaintext, saltRounds)
    }


    async initPasswords() {
        const users = this.getAllUsers()
        for (const user of users) {
            if (user.password) {
                const hashedPassword = await this.#hasPassword(user.password)
                user.password = hashedPassword
                await DatabaseService.users.findByIdAndUpdate(user._id, { password: hashedPassword })
            }
        }
    }




    /**
     * Retrieves a single user from the database by its ID.
     *
     * @param {string} searchId - The ID of the user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not found.
     */
    async getUserById(userId) {
        try {
            const user = await DatabaseService.users.findById(userId)
            return user
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Retrieves all users from the database.
     *
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects.
     */
    async getAllUsers() {
        try {
            const users = await DatabaseService.users.find()
            return users
        } catch (error) {
            console.log(error)

        }
    }

    /**
     * Retrieves a single user from the database by its name.
     *
     * @param {string} name - The name of the user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not found.
     */
    async getUserByName(searchName) {
        try {
            const user = await DatabaseService.users.findOne({ firstname : searchName })
            return user
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Adds a new user to the database.
     *
     * @param {Object} userData - The data of the user to add.
     * @returns {Promise<Object>} A promise that resolves to the newly created user object.
     */
    async addUser(userData) {
        try {
            const existingUser = await DatabaseService.users.findOne({ username: userData.username })
            if (existingUser) {
                throw new Error('User already exists')
            }
            const hashedPassword = await this.#hasPassword(userData.password)
            userData.password = hashedPassword
            const newUser = new DatabaseService.users(userData)
            await newUser.save()
            return newUser
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    /**
     * Updates an existing user in the database by its ID.
     *
     * @param {string} id - The ID of the user to update.
     * @param {Object} updateData - The data to update the user with.
     * @returns {Promise<Object|null>} A promise that resolves to the updated user object if successful, or null if not found.
     */
    async updateUser(id, updateData) {
        try {
            const updatedUser = await DatabaseService.users.findByIdAndUpdate(
                id,
                {
                    $set: {
                        firstname: updateData.firstname,
                        lastname: updateData.lastname,
                        email: updateData.email,
                        password: updateData.password,
                        role: updateData.role
                    }
                },
                {
                    new: true,         // Return the updated document
                    runValidators: true // Run schema validators
                }
            )
            return updatedUser
        } catch(error) {
            console.log(error)
            throw error
        }
    }

    /**
     * Deletes a user from the database by its ID.
     *
     * @param {string} id - The ID of the user to delete.
     * @returns {Promise<Object|null>} A promise that resolves to the deleted user object if successful, or null if not found.
     */
    async deleteUser(id) {
        try{
            const deletedUser = await DatabaseService.users.findByIdAndDelete(id)
            return deletedUser

        }catch (error) {
            error.message = 'Error deleting user'
            error.status = 400
            console.log(error)
            throw error
        }
    }

    async getUserByEmail(searchEmail) {
        try {
            const user = await DatabaseService.users.findOne({ email : searchEmail })
            return user
        } catch (error) {
            console.log(error)
        }
    }


    async getUserByUsername(searchUsername) {
        try {
            const user = await DatabaseService.users.findOne({ username : searchUsername })
            return user
        } catch (error) {
            console.log(error)
        }
    }


    /**
   * Login user and get a JWT token.
   *
   * @async
   * @param {object} username - The username.
   * @param {object} password - The password for the username.
   * @returns {Promise<string>} A JWT token if login succedded.
   */
    async login (username, password) {
        const user = await this.getUserByUsername(username)
        if (!user) {
            throw new Error('User does not exists')
        }

        const hashedPassword = user.password
        const success = await bcrypt.compare(password, hashedPassword)
        if (!success) {
            throw new Error('User and password dows not match')
        }

        const token = jwt.createJwtToken(user.username, user.role, user.email, user.firstname, user.lastname)
        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            }
        }

    }

    /**
 * Logs out the user by invalidating their JWT token.
 *
 * @async
 * @param {string} token - The JWT token to invalidate.
 * @returns {Promise<void>} A promise that resolves when the token is invalidated.
 */
    async logout(token) {
        try {
            await jwt.blacklist(token)
            console.log('User logged out successfully')
        } catch (error) {
            console.log(error)
            throw new Error('Error logging out')
        }
    }


    /**
     * Updates an password for user in the database by its ID.
     *
     * @param {string} username - The Id of the user to update.
     * @param {string} oldPassword - The old Password for the user.
     * @param {Object} newPassword - The new Password for the user.
     * @returns {Promise<Object|null>} A promise that resolves to the updated user object if successful, or null if not found.
     */
    async updatePassword(username, oldPassword, newPassword) {
        try {
            const hashedPassword = await this.#hasPassword(newPassword)
            newPassword = hashedPassword
            const user = await this.getUserByUsername(username)
            if (!user) {
                throw new Error('User not found')
            }
            const success = await bcrypt.compare(oldPassword, user.password)
            if (!success) {
                throw new Error('Old password is incorrect')
            }
            const updatedUser = await DatabaseService.users.findOneAndUpdate(
                { username: username },  // Find user by username
                {
                    $set: {
                        password: newPassword
                    }
                },
                {
                    new: true,         // Return the updated document
                    runValidators: true // Run schema validators
                }
            )
            return updatedUser
        } catch(error) {
            console.log(error)
            throw error
        }
    }


    /**
     * Forcefully updates a user's password without requiring the old password.
     *
     * This method is used specifically for password reset scenarios where the user
     * has received a valid JWT token (e.g., via email) and needs to set a new password.
     *
     *  Do NOT use this in authenticated sessions where the old password should be verified.
     * In such cases, use `updatePassword()` instead.
     *
     * @param {string} username - The username of the user to update.
     * @param {string} newPassword - The new password to be hashed and stored.
     * @returns {Promise<Object>} - The updated user object.
     */
    async forceUpdatePassword(username, newPassword) {
        const hashed = await bcrypt.hash(newPassword, 10)

        const updatedUser = await DatabaseService.users.findOneAndUpdate(
            { username },
            { $set: { password: hashed } },
            { new: true, runValidators: true }
        )

        return updatedUser
    }
    /**
     * Updates the user's profile image.
     *
     * @param {string} username - The username of the user to update.
     * @param {string} imageUrl - The new image URL or path.
     * @returns {Promise<Object|null>} The updated user object or null if not found.
     */
    async updateImage(username, imageUrl) {
        try {
            const updatedUser = await DatabaseService.users.findOneAndUpdate(
                { username },
                { $set: { image: imageUrl } },
                { new: true, runValidators: true }
            )
            return updatedUser
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

export default new UsersModel()
