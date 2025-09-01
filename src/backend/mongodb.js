// db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    // Skip actual DB connection during tests
    return;
  }
  console.log('🔌 Starting MongoDB connection...');
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};


export default connectDB;

// Note for future connections - need to add to ip whitelist in MongoDB Atlas
