require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/routes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8081;

// MongoDB Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
