import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './mongodb.js';
import guestRouter from './routes/EventGuest.js';
import eventRouter from './routes/EventData.js';
import exportRouter from './routes/EventExport.js';
import vendorRouter from './routes/EventVendor.js';
const server = express();
const port = 3000;

server.use(cors({
  origin: 'http://localhost:5173', // frontend URL
}));

//Database connection setup
connectDB();

server.use(express.json());

server.use('/guests', guestRouter);
server.use('/events', eventRouter);
server.use('/export', exportRouter);
server.use('/vendors', vendorRouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
