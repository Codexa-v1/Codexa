import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';

// Mock console so we can check logs
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock process.exit so it doesn’t actually exit the test
vi.spyOn(process, 'exit').mockImplementation(() => {});

// Import the module after mocks
import connectDB from '../backend/mongodb';

describe('connectDB', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should connect to MongoDB successfully', async () => {
    const mockConnect = vi.spyOn(mongoose, 'connect').mockResolvedValue({
      connection: { host: 'mockHost' },
    });

    await connectDB();

    expect(mockConnect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(console.log).toHaveBeenCalledWith('🔌 Starting MongoDB connection...');
    expect(console.log).toHaveBeenCalledWith('✅ MongoDB connected: mockHost');
  });

  it('should log error and exit on connection failure', async () => {
    const mockError = new Error('Connection failed');
    vi.spyOn(mongoose, 'connect').mockRejectedValue(mockError);

    await connectDB();

    expect(console.error).toHaveBeenCalledWith('❌ MongoDB connection failed:', 'Connection failed');
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
