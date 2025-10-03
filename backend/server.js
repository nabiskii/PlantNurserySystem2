// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
require('./subscribers/careTipSubscribers');

dotenv.config();

const app = express();

/* ------------ core middleware ------------ */
app.use(cors());
app.use(express.json());

// (debug) log each request so you can see exactly what hits the server
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

/* ------------ API routes ------------ */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/caretips', require('./routes/caretipsRoutes'));
app.use('/api/events', require('./routes/events'));
app.use('/api/wishlist', require('./routes/wishlistRoutes')); // <-- POST /api/wishlist

/* ------------ health check ------------ */
app.get('/health', (_req, res) => {
  res.json({ ok: true, port: process.env.PORT || 5001 });
});

/* ------------ 404 handler ------------ */
app.use((req, res) => {
  console.log('[404]', req.method, req.originalUrl);
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

/* ------------ error handler ------------ */
app.use((err, req, res, _next) => {
  console.error('[ERR]', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


// Export the app object for testing
if (require.main === module) {
  connectDB();
  // If the file is run directly, start the server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
