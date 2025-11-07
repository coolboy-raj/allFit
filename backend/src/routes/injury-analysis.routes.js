/**
 * Injury Analysis Routes
 * Professional Athlete Injury Prediction API Endpoints
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');
const { getAffectedBodyParts } = require('../services/body-part-mapping.service');
const { updateBodyPartWorkloads, calculateAthleteInjuryRisk, generateRiskMessage } = require('../services/athlete.service');
const { calculateInjuryRiskPercentage, getRiskLevel } = require('../services/injury-risk.service');

/**
 * POST /api/athletes
 * Create or update athlete profile
 */
router.post('/athletes', async (req, res) => {
  try {
    const { user_id, name, email, age, position, height, weight, primary_sport, team, status } = req.body;

    // Insert new athlete (no upsert - coaches can have multiple athletes)
    const { data, error } = await supabase
      .from('athletes')
      .insert({
        user_id,
        name,
        email,
        age,
        position,
        height,
        weight,
        primary_sport,
        team,
        status: status || 'active',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('[Injury Analysis] Error creating athlete:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/athletes/:athleteId
 * Get athlete by ID
 */
router.get('/athletes/:athleteId', async (req, res) => {
  try {
    const { athleteId } = req.params;

    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', athleteId)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('[Injury Analysis] Error fetching athlete:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/users/:userId/athletes
 * Get all athletes for a user
 */
router.get('/users/:userId/athletes', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('[Injury Analysis] Error fetching user athletes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/athletes/:athleteId
 * Update athlete profile
 */
router.put('/athletes/:athleteId', async (req, res) => {
  try {
    const { athleteId } = req.params;
    const updateData = req.body;

    // Don't allow updating user_id or created_at
    delete updateData.user_id;
    delete updateData.created_at;
    delete updateData.id;

    const { data, error } = await supabase
      .from('athletes')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', athleteId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('[Injury Analysis] Error updating athlete:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/athletes/:athleteId
 * Delete athlete and all associated data
 */
router.delete('/athletes/:athleteId', async (req, res) => {
  try {
    const { athleteId } = req.params;

    // Delete athlete (CASCADE will handle related records)
    const { error } = await supabase
      .from('athletes')
      .delete()
      .eq('id', athleteId);

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Athlete and all associated data deleted successfully',
    });
  } catch (error) {
    console.error('[Injury Analysis] Error deleting athlete:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/activities/log
 * Log a new activity (workout or sports)
 */
router.post('/activities/log', async (req, res) => {
  try {
    const activityData = req.body;

    // Validate required fields
    if (!activityData.athlete_id || !activityData.activity_type) {
      return res.status(400).json({ 
        success: false, 
        error: 'athlete_id and activity_type are required' 
      });
    }

    // Auto-detect affected body parts if not provided
    if (!activityData.affected_body_parts || activityData.affected_body_parts.length === 0) {
      activityData.affected_body_parts = getAffectedBodyParts(activityData);
    }

    console.log('[Injury Analysis] Logging activity:', {
      athlete_id: activityData.athlete_id,
      type: activityData.activity_type,
      affected_parts: activityData.affected_body_parts,
    });

    // Insert activity log
    const { data: activity, error: activityError } = await supabase
      .from('activity_logs')
      .insert({
        athlete_id: activityData.athlete_id,
        activity_type: activityData.activity_type,
        date: activityData.date || new Date().toISOString().split('T')[0],
        start_time: activityData.start_time,
        duration: activityData.duration,
        workout_type: activityData.workout_type,
        exercises: activityData.exercises || [],
        equipment_used: activityData.equipment_used || [],
        sport: activityData.sport,
        position: activityData.position,
        match_type: activityData.match_type,
        location: activityData.location,
        opponent: activityData.opponent,
        result: activityData.result,
        minutes_played: activityData.minutes_played,
        intensity_level: activityData.intensity_level,
        performance_metrics: activityData.performance_metrics || {},
        injuries: activityData.injuries || [],
        medical_attention: activityData.medical_attention,
        surface_type: activityData.surface_type,
        weather_conditions: activityData.weather_conditions,
        heart_rate_avg: activityData.heart_rate_avg,
        heart_rate_max: activityData.heart_rate_max,
        calories_burned: activityData.calories_burned,
        affected_body_parts: activityData.affected_body_parts,
        recovery_status: activityData.recovery_status || 'normal',
        fatigue_level: activityData.fatigue_level,
        notes: activityData.notes,
        coach_feedback: activityData.coach_feedback,
      })
      .select()
      .single();

    if (activityError) throw activityError;

    // Update body part workload for each affected body part
    const workloadUpdates = await updateBodyPartWorkloads(
      activityData.athlete_id,
      activityData.affected_body_parts,
      activityData
    );

    // Calculate overall injury risk
    const injuryRisk = await calculateAthleteInjuryRisk(activityData.athlete_id);

    res.json({ 
      success: true, 
      data: {
        activity,
        workload_updates: workloadUpdates,
        injury_risk: injuryRisk,
      }
    });
  } catch (error) {
    console.error('[Injury Analysis] Error logging activity:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/athletes/:athleteId/injury-risk
 * Get athlete injury risk analysis
 */
router.get('/athletes/:athleteId/injury-risk', async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Get body part workloads
    const { data: workloads, error: workloadError } = await supabase
      .from('body_part_workload')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('date', targetDate);

    if (workloadError) throw workloadError;

    // Get latest injury risk snapshot
    const { data: snapshot, error: snapshotError } = await supabase
      .from('injury_risk_snapshots')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('date', targetDate)
      .single();

    if (snapshotError && snapshotError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw snapshotError;
    }

    // Format body part data for frontend
    const bodyPartRisks = workloads?.map(w => ({
      part: w.body_part,
      risk: w.risk_level,
      percentage: w.injury_risk_percentage,
      message: generateRiskMessage(w),
    })) || [];

    res.json({
      success: true,
      data: {
        body_part_risks: bodyPartRisks,
        overall_risk: snapshot || null,
        workloads: workloads || [],
      },
    });
  } catch (error) {
    console.error('[Injury Analysis] Error fetching injury risk:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/athletes/:athleteId/activities
 * Get activity history for athlete
 */
router.get('/athletes/:athleteId/activities', async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('[Injury Analysis] Error fetching activities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/activities/:activityId
 * Get single activity by ID
 */
router.get('/activities/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('id', activityId)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('[Injury Analysis] Error fetching activity:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/activities/:activityId
 * Update an activity
 */
router.put('/activities/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;
    const updateData = req.body;

    // Don't allow updating athlete_id or created_at
    delete updateData.athlete_id;
    delete updateData.created_at;

    const { data, error } = await supabase
      .from('activity_logs')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activityId)
      .select()
      .single();

    if (error) throw error;

    // Recalculate injury risk for the athlete
    const injuryRisk = await calculateAthleteInjuryRisk(data.athlete_id);

    res.json({ 
      success: true, 
      data: {
        activity: data,
        injury_risk: injuryRisk,
      }
    });
  } catch (error) {
    console.error('[Injury Analysis] Error updating activity:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/activities/:activityId
 * Delete an activity
 */
router.delete('/activities/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;

    // Get the activity first to know the athlete_id
    const { data: activity, error: fetchError } = await supabase
      .from('activity_logs')
      .select('athlete_id, date, affected_body_parts')
      .eq('id', activityId)
      .single();

    if (fetchError) throw fetchError;

    // Delete the activity
    const { error: deleteError } = await supabase
      .from('activity_logs')
      .delete()
      .eq('id', activityId);

    if (deleteError) throw deleteError;

    // Recalculate workloads for affected body parts on that date
    if (activity.affected_body_parts && activity.affected_body_parts.length > 0) {
      for (const bodyPart of activity.affected_body_parts) {
        // Get remaining activities for this body part on this date
        const { data: remainingActivities } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('athlete_id', activity.athlete_id)
          .eq('date', activity.date)
          .contains('affected_body_parts', [bodyPart]);

        // If no activities left for this body part on this date, delete the workload record
        if (!remainingActivities || remainingActivities.length === 0) {
          await supabase
            .from('body_part_workload')
            .delete()
            .eq('athlete_id', activity.athlete_id)
            .eq('body_part', bodyPart)
            .eq('date', activity.date);
        } else {
          // Recalculate workload from remaining activities
          await updateBodyPartWorkloads(
            activity.athlete_id,
            [bodyPart],
            remainingActivities[0]
          );
        }
      }

      // Recalculate overall injury risk
      await calculateAthleteInjuryRisk(activity.athlete_id);
    }

    res.json({ 
      success: true, 
      message: 'Activity deleted successfully',
      athlete_id: activity.athlete_id,
    });
  } catch (error) {
    console.error('[Injury Analysis] Error deleting activity:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/recovery/daily-update
 * Daily recovery task - updates recovery rates for all athletes
 * In production, this would be triggered by a cron job
 */
router.post('/recovery/daily-update', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get all athletes
    const { data: athletes, error: athletesError } = await supabase
      .from('athletes')
      .select('id');

    if (athletesError) throw athletesError;

    const updates = [];

    for (const athlete of athletes) {
      // Get all body part workloads
      const { data: workloads } = await supabase
        .from('body_part_workload')
        .select('*')
        .eq('athlete_id', athlete.id)
        .order('date', { ascending: false });

      // Group by body part (get latest for each)
      const bodyPartMap = {};
      workloads?.forEach(w => {
        if (!bodyPartMap[w.body_part]) {
          bodyPartMap[w.body_part] = w;
        }
      });

      // Update each body part with recovery
      for (const [bodyPart, lastWorkload] of Object.entries(bodyPartMap)) {
        const daysSinceActivity = Math.floor(
          (new Date(today) - new Date(lastWorkload.date)) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceActivity > 0) {
          // Apply daily recovery (reduce workload by ~8% per day)
          const newWorkloadScore = Math.max(lastWorkload.workload_score * 0.92, 0);
          const newRecoveryRate = Math.min(lastWorkload.recovery_rate + 8, 100);

          // Recalculate injury risk with reduced workload
          const newRiskPercentage = calculateInjuryRiskPercentage({
            currentWorkload: newWorkloadScore,
            cumulative7day: lastWorkload.cumulative_7day * 0.92,
            cumulative30day: lastWorkload.cumulative_30day * 0.97,
            daysSinceLastActivity: daysSinceActivity,
            recoveryRate: newRecoveryRate,
            activityCount: lastWorkload.activity_count,
            avgIntensity: lastWorkload.avg_intensity,
          });

          const { data, error } = await supabase
            .from('body_part_workload')
            .upsert({
              athlete_id: athlete.id,
              body_part: bodyPart,
              date: today,
              workload_score: newWorkloadScore,
              cumulative_7day: lastWorkload.cumulative_7day * 0.92,
              cumulative_30day: lastWorkload.cumulative_30day * 0.97,
              injury_risk_percentage: newRiskPercentage,
              risk_level: getRiskLevel(newRiskPercentage),
              recovery_rate: newRecoveryRate,
              days_since_last_activity: daysSinceActivity,
              activity_count: 0,
              total_duration: 0,
              avg_intensity: lastWorkload.avg_intensity * 0.95,
            }, {
              onConflict: 'athlete_id,body_part,date',
            })
            .select()
            .single();

          if (data) updates.push(data);
        }
      }
    }

    res.json({ 
      success: true, 
      message: `Updated recovery rates for ${updates.length} body parts`,
      data: updates,
    });
  } catch (error) {
    console.error('[Injury Analysis] Error in daily recovery update:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

