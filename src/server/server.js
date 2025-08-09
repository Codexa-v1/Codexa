import express from 'express';
const guestRouter = require('./routes/guestList');
const eventRouter = require('./routes/eventData');
const exportRouter = require('./routes/exportData');
const vendorRouter = require('./routes/vendorList');
const server = express();
const port = 3000;

//Database connection setup


//The thing will connect to the database and start the server

server.use(express.json());

server.use('/guests', guestRouter);
server.use('/events', eventRouter);
server.use('/export', exportRouter);
server.use('/vendors', vendorRouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});