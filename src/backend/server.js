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
const port = process.env.PORT || 3000;

server.use(cors({
  origin: 'http://localhost:5173', // frontend URL
}));

//Database connection setup
connectDB();

server.use(express.json());


server.get('/', (req, res) => {
  res.send('Codexa backend is running.');
});

server.use('/api/guests', guestRouter);
server.use('/api/events', eventRouter);
server.use('/api/export', exportRouter);
server.use('/api/vendors', vendorRouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
