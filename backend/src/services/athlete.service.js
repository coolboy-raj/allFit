/**
 * Athlete Service
 * Handles athlete-related business logic and database operations
 */

const { supabase } = require('../config/database');
const { calculateBodyPartWorkload, calculateRecoveryRate } = require('./workload.service');
const { calculateInjuryRiskPercentage, getRiskLevel, getRiskMessage } = require('./injury-risk.service');
const { EXERCISE_BODY_PART_MAP, getBodyPartIntensityMultiplier } = require('./body-part-mapping.service');

/**
 * Update body part workloads after activity
 */
async function updateBodyPartWorkloads(athleteId, bodyParts, activityData) {
  const updates = [];
  const today = activityData.date || new Date().toISOString().split('T')[0];

  for (const bodyPart of bodyParts) {
    try {
      // Calculate workload for this body part
      let workloadScore = 0;

      if (activityData.activity_type === 'workout' && activityData.exercises) {
        // Sum workload from all exercises affecting this body part
        for (const exercise of activityData.exercises) {
          const exerciseParts = EXERCISE_BODY_PART_MAP[exercise.exercise] || [];
          if (exerciseParts.includes(bodyPart)) {
            const baseWorkload = calculateBodyPartWorkload({
              intensity: exercise.intensity || activityData.intensity_level || 'moderate',
              duration: activityData.duration / activityData.exercises.length, // Distribute duration
              recoveryStatus: activityData.recovery_status,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
            });
            
            // Apply body part-specific intensity multiplier
            const intensityMultiplier = getBodyPartIntensityMultiplier(bodyPart, {
              ...activityData,
              exercises: [exercise], // Pass individual exercise for context
            });
            
            workloadScore += baseWorkload * intensityMultiplier;
          }
        }
      } else if (activityData.activity_type === 'sports') {
        const baseWorkload = calculateBodyPartWorkload({
          intensity: activityData.intensity_level || 'hard',
          duration: activityData.minutes_played || activityData.duration,
          recoveryStatus: activityData.recovery_status,
          sport: activityData.sport,
          matchType: activityData.match_type,
        });
        
        // Apply body part-specific intensity multiplier for sports
        const intensityMultiplier = getBodyPartIntensityMultiplier(bodyPart, activityData);
        workloadScore = baseWorkload * intensityMultiplier;
      }

      // Get existing workload data for rolling calculations
      const { data: existing } = await supabase
        .from('body_part_workload')
        .select('*')
        .eq('athlete_id', athleteId)
        .eq('body_part', bodyPart)
        .order('date', { ascending: false })
        .limit(30);

      // Calculate cumulative workloads
      const last7Days = existing?.slice(0, 7) || [];
      const last30Days = existing || [];

      const cumulative7day = last7Days.reduce((sum, record) => sum + parseFloat(record.workload_score || 0), 0) + workloadScore;
      const cumulative30day = last30Days.reduce((sum, record) => sum + parseFloat(record.workload_score || 0), 0) + workloadScore;

      // Calculate average intensity
      const avgIntensity = last7Days.length > 0
        ? last7Days.reduce((sum, r) => sum + parseFloat(r.avg_intensity || 0), 0) / last7Days.length
        : 0;

      // Calculate recovery rate
      const lastRecord = existing && existing.length > 0 ? existing[0] : null;
      const daysSinceLastActivity = lastRecord 
        ? Math.floor((new Date(today) - new Date(lastRecord.date)) / (1000 * 60 * 60 * 24))
        : 7;
      
      const recoveryRate = calculateRecoveryRate(daysSinceLastActivity);

      // Check for active injuries
      const { data: activeInjuries } = await supabase
        .from('injury_history')
        .select('id')
        .eq('athlete_id', athleteId)
        .eq('body_part', bodyPart)
        .eq('status', 'active');

      const hasActiveInjury = activeInjuries && activeInjuries.length > 0;

      // Calculate injury risk percentage
      const injuryRiskPercentage = calculateInjuryRiskPercentage({
        currentWorkload: workloadScore,
        cumulative7day,
        cumulative30day,
        daysSinceLastActivity,
        recoveryRate,
        activityCount: last7Days.length + 1,
        avgIntensity,
        hasActiveInjury,
      });

      const riskLevel = getRiskLevel(injuryRiskPercentage);

      // Upsert body part workload
      const { data, error } = await supabase
        .from('body_part_workload')
        .upsert({
          athlete_id: athleteId,
          body_part: bodyPart,
          date: today,
          workload_score: workloadScore,
          cumulative_7day: cumulative7day,
          cumulative_30day: cumulative30day,
          injury_risk_percentage: injuryRiskPercentage,
          risk_level: riskLevel,
          recovery_rate: recoveryRate,
          days_since_last_activity: 0, // Just did activity
          activity_count: last7Days.length + 1,
          total_duration: activityData.duration,
          avg_intensity: avgIntensity,
        }, {
          onConflict: 'athlete_id,body_part,date',
        })
        .select()
        .single();

      if (error) throw error;

      updates.push(data);
    } catch (error) {
      console.error(`[Athlete Service] Error updating workload for ${bodyPart}:`, error);
    }
  }

  return updates;
}

/**
 * Calculate overall athlete injury risk
 */
async function calculateAthleteInjuryRisk(athleteId) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get all body part workloads for today
    const { data: workloads, error } = await supabase
      .from('body_part_workload')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('date', today);

    if (error) throw error;

    if (!workloads || workloads.length === 0) {
      return null;
    }

    // Calculate overall risk score (weighted average)
    const totalRisk = workloads.reduce((sum, w) => sum + (w.injury_risk_percentage || 0), 0);
    const overallRiskScore = Math.round(totalRisk / workloads.length);
    const riskLevel = getRiskLevel(overallRiskScore);

    // Categorize body parts by risk
    const highRiskParts = workloads.filter(w => w.injury_risk_percentage >= 60).map(w => w.body_part);
    const mediumRiskParts = workloads.filter(w => w.injury_risk_percentage >= 40 && w.injury_risk_percentage < 60).map(w => w.body_part);

    // Calculate contributing factors
    const avgTrainingLoad = workloads.reduce((sum, w) => sum + parseFloat(w.cumulative_7day || 0), 0) / workloads.length;
    const avgRecovery = workloads.reduce((sum, w) => sum + parseFloat(w.recovery_rate || 100), 0) / workloads.length;
    const fatigueIndex = 100 - avgRecovery;

    // Generate recommendations
    const recommendations = [];
    if (overallRiskScore >= 60) {
      recommendations.push({
        priority: 'high',
        title: 'Reduce Training Intensity',
        description: 'High injury risk detected. Reduce training intensity by 30-40% for the next 3-5 days.',
      });
    }
    if (highRiskParts.length > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Target Recovery for High-Risk Areas',
        description: `Focus recovery efforts on: ${highRiskParts.join(', ')}. Consider physiotherapy or additional rest.`,
      });
    }
    if (avgRecovery < 70) {
      recommendations.push({
        priority: 'medium',
        title: 'Increase Recovery Time',
        description: 'Recovery deficit detected. Schedule additional rest days and ensure adequate sleep (8+ hours).',
      });
    }

    // Save snapshot
    const { data: snapshot, error: snapshotError } = await supabase
      .from('injury_risk_snapshots')
      .upsert({
        athlete_id: athleteId,
        date: today,
        overall_risk_score: overallRiskScore,
        risk_level: riskLevel,
        training_load_score: avgTrainingLoad,
        fatigue_index: fatigueIndex,
        recovery_score: avgRecovery,
        high_risk_body_parts: highRiskParts,
        medium_risk_body_parts: mediumRiskParts,
        recommendations,
      }, {
        onConflict: 'athlete_id,date',
      })
      .select()
      .single();

    if (snapshotError) throw snapshotError;

    return snapshot;
  } catch (error) {
    console.error('[Athlete Service] Error calculating athlete injury risk:', error);
    return null;
  }
}

/**
 * Generate risk message for body part workload
 */
function generateRiskMessage(workload) {
  const risk = workload.injury_risk_percentage;
  const bodyPart = workload.body_part.replace('-', ' ');

  if (risk >= 80) {
    return `CRITICAL: Immediate rest required for ${bodyPart}. Extremely high overuse detected.`;
  } else if (risk >= 60) {
    return `HIGH RISK: Significant overuse in ${bodyPart}. Reduce training load by 30-40%.`;
  } else if (risk >= 40) {
    return `MODERATE: Elevated stress in ${bodyPart}. Monitor closely and maintain proper recovery.`;
  } else if (risk >= 20) {
    return `LOW: Mild fatigue in ${bodyPart}. Continue current training with adequate rest.`;
  } else {
    return `MINIMAL: ${bodyPart} is in optimal condition. Current training load is appropriate.`;
  }
}

module.exports = {
  updateBodyPartWorkloads,
  calculateAthleteInjuryRisk,
  generateRiskMessage,
};

