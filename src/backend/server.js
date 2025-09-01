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

const server = express();
const port = process.env.PORT || 3000;

// ✅ Allow both localhost (dev) and Azure Static Web Apps (prod)
server.use(cors({
  origin: [
    'http://localhost:5173',
    'https://victorious-ground-09423c310.1.azurestaticapps.net'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Database connection setup
connectDB();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('Codexa backend is running.');
});

// API routes
server.use('/api/guests', guestRouter);
server.use('/api/events', eventRouter);
server.use('/api/export', exportRouter);
server.use('/api/vendors', vendorRouter);
server.use('/api/venues', venueRouter);
server.use('/api/schedules', scheduleRouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
