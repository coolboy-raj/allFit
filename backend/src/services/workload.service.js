/**
 * Workload Calculation Service
 * Handles workload score calculations for body parts
 */

const { INTENSITY_MULTIPLIERS, RECOVERY_MODIFIERS, MATCH_TYPE_MULTIPLIERS } = require('../config/constants');

/**
 * Calculate workload score for a body part based on activity
 * Formula considers: intensity, duration, recovery status, and exercise type
 */
function calculateBodyPartWorkload(params) {
  const {
    intensity = 'moderate',
    duration = 60, // minutes
    recoveryStatus = 'normal',
    exerciseType = null,
    sets = 0,
    reps = 0,
    weight = 0,
    sport = null,
    matchType = null,
  } = params;

  let baseWorkload = 10; // Base workload score

  // Apply intensity
  baseWorkload *= INTENSITY_MULTIPLIERS[intensity] || 1.0;

  // Apply duration factor
  const durationFactor = Math.min(duration / 60, 3.0); // Cap at 3x for very long sessions
  baseWorkload *= (0.3 + durationFactor * 0.7);

  // Apply recovery modifier
  baseWorkload *= RECOVERY_MODIFIERS[recoveryStatus] || 1.0;

  // For strength training, add volume-based workload
  if (sets > 0 && reps > 0) {
    const volumeScore = (sets * reps * Math.sqrt(weight || 1)) / 10;
    baseWorkload += volumeScore;
  }

  // For sports, apply match type multiplier
  if (sport && matchType) {
    baseWorkload *= MATCH_TYPE_MULTIPLIERS[matchType] || 1.0;
  }

  return Math.round(baseWorkload * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate recovery rate (decreases workload over time with rest)
 * Recovery happens naturally each day without activity
 */
function calculateRecoveryRate(daysSinceLastActivity, baseRecoveryRate = 8) {
  // Recover 8% per day by default, up to 100%
  const recoveryGained = Math.min(daysSinceLastActivity * baseRecoveryRate, 100);
  return Math.min(recoveryGained, 100);
}

module.exports = {
  calculateBodyPartWorkload,
  calculateRecoveryRate,
};



