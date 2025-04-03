import mysql from 'mysql2/promise'
import { config } from '../config/database.js'

/**
 * Service (singleton) to manage database operations.
 *
 * @class
 */
class DatabaseService {
  #connection = null

  /**
   * Connect to the database using the configuration provided.
   *
   * @async
   * @returns {Promise<void>}
   */
  async connect () {
    try {
      this.#connection = await mysql.createConnection(config)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Format a sql query.
   *
   * @param {string} sql - The SQL to be formatted.
   * @param {Array} [params=[]] - The parameters for the query.
   * @param param
   * @returns {string} as SQL query.
   */
  format (sql, param) {
    return mysql.format(sql, param)
  }

  /**
   * Execute a database query.
   *
   * @async
   * @param {string} queryString - The SQL query string.
   * @param {Array} [params=[]] - The parameters for the query.
   * @returns {Promise<object>} The result of the query.
   * @throws {Error} If the query execution fails.
   */
  async query (queryString, params = []) {
    try {
      const [rows] = await this.#connection.execute(queryString, params)
      return rows
    } catch (error) {
      throw new Error(`Database error: ${error.message}`)
    }
  }

  /**
   * Close the database connection pool.
   *
   * @async
   */
  async closeConnection () {
    try {
      await this.#connection.end()
    } catch (err) {
      console.error('Error closing the database connection:', err.message)
      throw err
    }
  }
}

export default new DatabaseService()
