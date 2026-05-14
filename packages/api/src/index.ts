import express from 'express';
import cors from 'express';
import dotenv from 'dotenv';
import menuRoutes from './routes/menu';
import chatRoutes from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsMiddleware = require('cors');
app.use(corsMiddleware());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Intelligent Bistro API is running' });
});

app.use('/api/menu', menuRoutes);
app.use('/api/chat', chatRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
