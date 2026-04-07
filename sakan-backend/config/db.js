const mongoose = require('mongoose');

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (cachedConnection && cachedConnection.readyState === 1) return cachedConnection;
  if (cachedPromise) return cachedPromise;

  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGODB_URI is missing.');

    cachedPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    }).then((conn) => {
      cachedConnection = conn.connection;
      console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
      return cachedConnection;
    }).catch((error) => {
      cachedPromise = null;
      throw error;
    });

    return cachedPromise;
  } catch (error) {
    console.error(`❌ Erreur MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
