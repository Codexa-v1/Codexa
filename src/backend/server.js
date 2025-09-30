import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './mongodb.js';
import guestRouter from './routes/EventGuest.js';
import eventRouter from './routes/EventData.js';
import exportRouter from './routes/EventExport.js';
import vendorRouter from './routes/EventVendor.js';
import venueRouter from './routes/EventVenue.js';
import scheduleRouter from './routes/EventSchedule.js';
import azureRouter from './routes/AzureRoutes.js';

const server = express();
const port = process.env.PORT || 3000;

server.use(cors({
  origin: [
    'http://localhost:5173',
    'https://victorious-ground-09423c310.1.azurestaticapps.net'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

connectDB(); // will be mocked in tests
server.use(express.json());

server.get('/', (req, res) => res.send('Codexa backend is running.'));

server.use('/api/guests', guestRouter);
server.use('/api/events', eventRouter);
server.use('/api/export', exportRouter);
server.use('/api/vendors', vendorRouter);
server.use('/api/venues', venueRouter);
server.use('/api/schedules', scheduleRouter);
server.use('/api/azure', azureRouter);

// Only listen if not in test environment
if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
}

export default server;
