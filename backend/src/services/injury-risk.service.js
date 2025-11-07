/**
 * Injury Risk Calculation Service
 * Calculates injury risk percentages and levels
 */

const { RISK_THRESHOLDS } = require('../config/constants');

/**
 * Calculate injury risk percentage for a body part
 * Based on: cumulative workload, recent activity spike, recovery status
 */
function calculateInjuryRiskPercentage(params) {
  const {
    currentWorkload = 0,
    cumulative7day = 0,
    cumulative30day = 0,
    daysSinceLastActivity = 0,
    recoveryRate = 100,
    activityCount = 0,
    avgIntensity = 0,
    hasActiveInjury = false,
  } = params;

  let riskScore = 0;

  // 1. Current workload factor (0-30 points)
  const workloadRisk = Math.min((currentWorkload / 100) * 30, 30);
  riskScore += workloadRisk;

  // 2. Cumulative load factor (0-25 points)
  const avgDailyLoad = cumulative7day / 7;
  const loadRisk = Math.min((avgDailyLoad / 50) * 25, 25);
  riskScore += loadRisk;

  // 3. Acute:Chronic workload ratio (0-20 points)
  const acuteLoad = cumulative7day;
  const chronicLoad = cumulative30day / 30;
  const acuteChronicRatio = chronicLoad > 0 ? acuteLoad / (chronicLoad * 7) : 0;
  
  // Optimal ratio is 0.8-1.3, risk increases outside this range
  let ratioRisk = 0;
  if (acuteChronicRatio > 1.5) {
    ratioRisk = Math.min((acuteChronicRatio - 1.5) * 20, 20);
  } else if (acuteChronicRatio < 0.5 && chronicLoad > 10) {
    ratioRisk = Math.min((0.5 - acuteChronicRatio) * 15, 15);
  }
  riskScore += ratioRisk;

  // 4. Recovery deficit (0-15 points)
  const recoveryDeficit = (100 - recoveryRate) / 100 * 15;
  riskScore += recoveryDeficit;

  // 5. Activity frequency risk (0-10 points)
  if (activityCount > 6) { // More than 6 activities in a week
    riskScore += Math.min((activityCount - 6) * 2, 10);
  }

  // 6. Active injury multiplier
  if (hasActiveInjury) {
    riskScore *= 1.5;
  }

  // Ensure result is between 0 and 100
  return Math.min(Math.max(Math.round(riskScore), 0), 100);
}

/**
 * Get risk level label from percentage
 */
function getRiskLevel(percentage) {
  if (percentage >= RISK_THRESHOLDS.CRITICAL) return 'critical';
  if (percentage >= RISK_THRESHOLDS.HIGH) return 'high';
  if (percentage >= RISK_THRESHOLDS.MEDIUM) return 'medium';
  if (percentage >= RISK_THRESHOLDS.LOW) return 'low';
  return 'minimal';
}

/**
 * Get risk message based on percentage and body part
 */
function getRiskMessage(percentage, bodyPart) {
  const level = getRiskLevel(percentage);
  
  const messages = {
    critical: `CRITICAL: ${bodyPart} shows very high injury risk. Immediate rest recommended.`,
    high: `HIGH RISK: ${bodyPart} is significantly overworked. Reduce intensity and volume.`,
    medium: `MODERATE: ${bodyPart} approaching overuse. Monitor closely and consider active recovery.`,
    low: `LOW RISK: ${bodyPart} is within safe training load. Continue monitoring.`,
    minimal: `OPTIMAL: ${bodyPart} is well-recovered and ready for training.`,
  };
  
  return messages[level] || messages.minimal;
}

module.exports = {
  calculateInjuryRiskPercentage,
  getRiskLevel,
  getRiskMessage,
};


