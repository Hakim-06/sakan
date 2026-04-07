const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGODB_URI is missing.');

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`❌ Erreur MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
