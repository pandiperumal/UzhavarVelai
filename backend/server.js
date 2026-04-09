const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/farmer', require('./routes/farmer'));
app.use('/api/labour', require('./routes/labour'));
app.use('/api/machinery', require('./routes/machinery'));
app.use('/api/intermediary', require('./routes/intermediary'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/notification', require('./routes/notification'));
app.use('/api/geo', require('./routes/geo'));
app.use('/api/crops', require('./routes/crops'));

app.get('/', (req, res) => {
  res.json({ 
    message: 'UzhavarVelai.com API Server',
    version: '1.0.0',
    description: 'Agricultural platform for Tamil Nadu connecting Farmers, Labour, Machinery Owners'
  });
});

app.get('/api', (req, res) => {
  res.json({
    endpoints: {
      auth: '/api/auth',
      farmer: '/api/farmer',
      labour: '/api/labour',
      machinery: '/api/machinery',
      intermediary: '/api/intermediary',
      admin: '/api/admin',
      booking: '/api/booking',
      notification: '/api/notification',
      geo: '/api/geo',
      crops: '/api/crops'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
