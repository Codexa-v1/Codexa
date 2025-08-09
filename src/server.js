import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './mongodb.js';
import guestRouter from './routes/guestList.js';
import eventRouter from './routes/eventData.js';
import exportRouter from './routes/export.js';
import vendorRouter from './routes/vendor.js';
const server = express();
const port = 3000;

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
