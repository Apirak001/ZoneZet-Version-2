/**
 * ============================================================================
 * Project: ZoneZet Version 2 (Course 801201)
 * File: backend/server.js
 * Description:
 *   - Node.js & Express REST API Server
 *   - Clean Separation: Backend API dedicated server
 *   - Proxy & Data Guard: Sanitizes, caches, and validates World Bank API data
 *   - Resilient Architecture: In-Memory Cache (O(1)), FIFO Task Queue, Safe Fallback
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');

const indicatorRoutes = require('./routes/indicatorRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const cache = require('./utils/dsaCache');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow React Vite frontend
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request timing & analytics middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: cache.getStats()
  });
});

// Mount Routes
app.use('/api', indicatorRoutes);
app.use('/api', comparisonRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'ROUTE_NOT_FOUND',
    message: `API route ${req.originalUrl} does not exist.`
  });
});

// Global Error Handler (Prevents system crash)
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack || err.message);
  res.status(err.status || 500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred, but the system remained operational.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server (skipped when imported as a serverless function, e.g. on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 ZoneZet Version 2 Backend is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;
