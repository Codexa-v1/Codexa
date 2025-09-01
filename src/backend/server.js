
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

const app = express();
const port = process.env.PORT || 3000;

// ✅ Allow both localhost (dev) and Azure Static Web Apps (prod)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://victorious-ground-09423c310.1.azurestaticapps.net'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Database connection setup
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Codexa backend is running.');
});

// API routes
app.use('/api/guests', guestRouter);
app.use('/api/events', eventRouter);
app.use('/api/export', exportRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/venues', venueRouter);
app.use('/api/schedules', scheduleRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
