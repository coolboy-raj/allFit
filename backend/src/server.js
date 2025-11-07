/**
 * TotalFit Gym Backend Server
 * Main Express server combining all routes
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const { PORT, NODE_ENV } = require('./config/constants');

// Import routes
const apiRoutes = require('./routes/api.routes');
const injuryAnalysisRoutes = require('./routes/injury-analysis.routes');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'totalfit-backend',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api (FatSecret, Clarifai)',
      injury: '/api (Injury Analysis)',
    }
  });
});

// API proxy routes (FatSecret, Clarifai)
app.use('/api', apiRoutes);

// Injury analysis routes
app.use('/api', injuryAnalysisRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('[Server Error]', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? error.message : undefined,
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║        🏋️  TotalFit Gym Backend Server  💪        ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📊 Available Services:');
  console.log('   • FatSecret API Proxy (Nutrition data)');
  console.log('   • Clarifai API Proxy (Food recognition)');
  console.log('   • Injury Analysis Engine (Professional athletes)');
  console.log('');
  console.log('✅ Server ready to accept requests');
  console.log('');
});

module.exports = app;

