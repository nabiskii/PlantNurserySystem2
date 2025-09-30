// backend/server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load backend/.env (not the root)
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());

// middleware that attaches req.user
const attachUser = require('./middleware/attachUser');
app.use(attachUser);

// routers (each file must `module.exports = router`)
const authRoutes     = require('./routes/authRoutes');
const plantRoutes    = require('./routes/plantRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const caretipsRoutes = require('./routes/caretipsRoutes');
// const eventsRoutes   = require('./routes/events'); // mount only if it's a Router
const wishlistRoutes = require('./routes/wishlistRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/caretips', caretipsRoutes);
// if (typeof eventsRoutes === 'function') app.use('/api/events', eventsRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error('[ERR]', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start even if DB is down (so /health works). You can tighten later.
async function start() {
  try {
    await connectDB();
    console.log('✅ Mongo connected');
  } catch (e) {
    console.error('❌ Mongo connect failed:', e.message);
  }
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (require.main === module) start();
module.exports = app;
