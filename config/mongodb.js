const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
/**
 * Connects to MongoDB using the provided connection options.
 * This code defines an async function connectToMongoDB that establishes a connection to a MongoDB database using the URL provided in the environment variables. It returns a Promise that resolves to the MongoDB database client. If the connection fails, it throws an error and logs the details.
 * @return {Promise<Db>} A Promise that resolves to the MongoDB database client
 */
async function connectToMongoDB() {
  const uri = process.env.MONGO_DB_URL;
  if (!uri) {
    throw new Error('MongoDB connection URL is not defined in environment variables');
  }

  const connectionOptions = {
    serverApi: ServerApiVersion.v1,
  };

  const client = new MongoClient(uri, connectionOptions);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('chopperDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

module.exports = { connectToMongoDB };
