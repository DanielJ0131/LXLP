import { MongoClient } from 'mongodb'
import { config } from '../config/database.js'

/**
 * Service (singleton) to manage database operations.
 *
 * @class
 */
class DatabaseService {
  #client = null
  #db = null

  /**
   * Connect to the MongoDB database using the configuration provided.
   *
   * @async
   * @returns {Promise<void>}
   */
  async connect () {
    try {
      this.#client = new MongoClient(config.url)
      await this.#client.connect()
      this.#db = this.#client.db() // Use the default database from the connection string
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message)
      throw error
    }
  }

  /**
   * Get a reference to a collection.
   *
   * @param {string} collectionName - The name of the collection.
   * @returns {object} The MongoDB collection.
   */
  getCollection (collectionName) {
    if (!this.#db) {
      throw new Error('Database connection is not established.')
    }
    return this.#db.collection(collectionName)
  }

  /**
   * Close the MongoDB connection.
   *
   * @async
   */
  async closeConnection () {
    try {
      if (this.#client) {
        await this.#client.close()
      }
    } catch (err) {
      console.error('Error closing the MongoDB connection:', err.message)
      throw err
    }
  }
}

export default new DatabaseService()
