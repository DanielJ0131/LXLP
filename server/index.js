import { app } from './src/express.js'
import databaseService from './src/service/DatabaseService.js'

// Connect to the database
await databaseService.connect()

// Start the express server
const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  const link = `http://localhost:${port}`;
  console.log(`\n\x1b[31mServer listening at \x1b]8;;${link}\x1b\\${link}\x1b]8;;\x1b\\\x1b[0m\n`);
});

/**
 * Shut down all services.
 */
async function shutdown () {
  server.close()
  await databaseService.closeConnection()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
