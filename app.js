import { app } from './src/express.js'
// import databaseService from './src/service/DatabaseService.js'

// Connect to the database
// await databaseService.connect()

// Start the express server
const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

/**
 * Shut down all services.
 */
async function shutdown () {
  server.close()
  // await databaseService.closeConnection()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
