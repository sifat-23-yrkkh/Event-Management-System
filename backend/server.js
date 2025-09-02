const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 9000;
require('dotenv').config();
const app = express();
const connectToDatabase = require('./Config/db');
const userRoute = require('./Routes/UserRoute');
const eventPackageRoute = require('./Routes/EventPackageRoute');
const bookingRoute = require('./Routes/BookingRoute');
const reviewRoutes = require("./Routes/ReviewRoute");


// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectToDatabase();


// Routes
app.use('/users', userRoute);
app.use('/events', eventPackageRoute);
app.use('/bookings', bookingRoute);
app.use('/review', reviewRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});