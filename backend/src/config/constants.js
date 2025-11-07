/**
 * Application Constants
 */

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // External API URLs
  FATSECRET_API_URL: 'https://platform.fatsecret.com/rest/server.api',
  CLARIFAI_API_URL: 'https://api.clarifai.com/v2/users/clarifai/apps/main/models/food-item-recognition/outputs',

  // Workload calculation constants
  INTENSITY_MULTIPLIERS: {
    'very-light': 0.3,
    'light': 0.5,
    'moderate': 1.0,
    'hard': 1.5,
    'very-hard': 2.0,
    'maximum': 2.5,
  },

  RECOVERY_MODIFIERS: {
    'excellent': 0.7,
    'good': 0.85,
    'normal': 1.0,
    'mild-soreness': 1.15,
    'significant-fatigue': 1.4,
    'concerning': 1.7,
    'injured': 2.0,
  },

  MATCH_TYPE_MULTIPLIERS: {
    'training': 0.5,
    'practice': 0.6,
    'friendly': 0.8,
    'competitive': 1.5,
    'tournament': 1.8,
    'playoff': 2.0,
  },

  // Injury risk thresholds
  RISK_THRESHOLDS: {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 80,
    CRITICAL: 90,
  },

  // Recovery rate (percentage recovered per day)
  DAILY_RECOVERY_RATE: 0.05, // 5% per day
};

