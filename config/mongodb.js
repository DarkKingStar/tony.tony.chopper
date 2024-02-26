const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

async function connectToMongoDB() {
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  };

  const client = new MongoClient(process.env.MONGO_DB_URL, connectionOptions);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('chopperDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    throw err;
  }
}

module.exports = { connectToMongoDB };
