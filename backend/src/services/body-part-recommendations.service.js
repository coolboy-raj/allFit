/**
 * Body Part Specific Recommendation Service
 * Generates unique, actionable recommendations for each body part based on injury risk
 */

/**
 * Generate body-part-specific recommendations
 * @param {string} bodyPart - The body part (e.g., 'right-shoulder', 'left-leg')
 * @param {number} riskPercentage - Risk percentage (0-100)
 * @param {object} workloadData - Additional workload context
 * @returns {Array} Array of recommendation objects
 */
function generateBodyPartRecommendations(bodyPart, riskPercentage, workloadData = {}) {
  const recommendations = [];
  const riskLevel = getRiskLevel(riskPercentage);
  const bodyPartName = formatBodyPartName(bodyPart);

  // Get body-part-specific recommendations based on risk level
  const specificRecs = getBodyPartSpecificAdvice(bodyPart, riskLevel, workloadData);
  
  specificRecs.forEach((rec, index) => {
    recommendations.push({
      priority: rec.priority,
      title: rec.title,
      description: rec.description,
      bodyPart: bodyPart,
      riskLevel: riskLevel,
    });
  });

  return recommendations;
}

/**
 * Get risk level from percentage
 */
function getRiskLevel(percentage) {
  if (percentage >= 80) return 'critical';
  if (percentage >= 60) return 'high';
  if (percentage >= 40) return 'medium';
  if (percentage >= 20) return 'low';
  return 'minimal';
}

/**
 * Format body part name for display
 */
function formatBodyPartName(bodyPart) {
  return bodyPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Body-part-specific recommendations based on anatomy and common injury patterns
 */
function getBodyPartSpecificAdvice(bodyPart, riskLevel, workloadData) {
  const recommendations = [];

  // Map body parts to their specific advice
  const bodyPartAdvice = {
    // SHOULDERS
    'right-shoulder': {
      critical: [
        {
          priority: 'high',
          title: 'Immediate Rest for Right Shoulder',
          description: 'Stop all overhead movements, pressing, and throwing activities immediately. Apply ice for 15-20 minutes every 2-3 hours. Rotator cuff inflammation detected.',
        },
        {
          priority: 'high',
          title: 'Medical Evaluation Required',
          description: 'Schedule appointment with sports medicine specialist. Possible rotator cuff strain or impingement. Avoid sleep on right side.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Overhead Activity',
          description: 'Eliminate overhead pressing, swimming, and throwing for 48-72 hours. Focus on scapular stabilization exercises and gentle mobility work.',
        },
        {
          priority: 'medium',
          title: 'Rotator Cuff Protection',
          description: 'Perform external rotation stretches (doorway stretch), shoulder blade squeezes, and band pull-aparts. Ice after any activity.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Shoulder Training',
          description: 'Reduce weight on pressing movements by 30%. Focus on proper scapular mechanics. Add extra warm-up sets with resistance bands.',
        },
        {
          priority: 'low',
          title: 'Preventive Stretching',
          description: 'Perform sleeper stretch and cross-body shoulder stretch 2-3x daily. Apply heat before training, ice after.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Maintain Shoulder Health',
          description: 'Continue proper warm-up including band work and dynamic stretching. Monitor form on pressing movements.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Right Shoulder Condition',
          description: 'Shoulder is well-recovered. Maintain current training program. Consider adding 1-2 sets of rotator cuff strengthening weekly.',
        },
      ],
    },
    'left-shoulder': {
      critical: [
        {
          priority: 'high',
          title: 'Immediate Rest for Left Shoulder',
          description: 'Stop all overhead movements, pressing, and throwing activities immediately. Apply ice for 15-20 minutes every 2-3 hours. Rotator cuff inflammation detected.',
        },
        {
          priority: 'high',
          title: 'Medical Evaluation Required',
          description: 'Schedule appointment with sports medicine specialist. Possible rotator cuff strain or impingement. Avoid sleep on left side.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Overhead Activity',
          description: 'Eliminate overhead pressing, swimming, and throwing for 48-72 hours. Focus on scapular stabilization exercises and gentle mobility work.',
        },
        {
          priority: 'medium',
          title: 'Rotator Cuff Protection',
          description: 'Perform external rotation stretches (doorway stretch), shoulder blade squeezes, and band pull-aparts. Ice after any activity.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Shoulder Training',
          description: 'Reduce weight on pressing movements by 30%. Focus on proper scapular mechanics. Add extra warm-up sets with resistance bands.',
        },
        {
          priority: 'low',
          title: 'Preventive Stretching',
          description: 'Perform sleeper stretch and cross-body shoulder stretch 2-3x daily. Apply heat before training, ice after.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Maintain Shoulder Health',
          description: 'Continue proper warm-up including band work and dynamic stretching. Monitor form on pressing movements.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Left Shoulder Condition',
          description: 'Shoulder is well-recovered. Maintain current training program. Consider adding 1-2 sets of rotator cuff strengthening weekly.',
        },
      ],
    },

    // LEGS
    'right-leg': {
      critical: [
        {
          priority: 'high',
          title: 'Stop All Lower Body Training',
          description: 'Immediate cessation of running, jumping, squatting, and lunging. Possible hamstring or quadriceps strain. Rest and elevate leg. Use compression if swelling present.',
        },
        {
          priority: 'high',
          title: 'Ice and Medical Assessment',
          description: 'Apply ice 20 minutes every 2 hours. Consult sports medicine professional within 24 hours. Muscle tear risk is elevated.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Leg Training Volume',
          description: 'Cut running distance by 50% and avoid high-intensity sprinting. No heavy squats or deadlifts for 3-4 days. Focus on single-leg stability work.',
        },
        {
          priority: 'medium',
          title: 'Hamstring and Quad Protection',
          description: 'Perform dynamic leg swings, foam rolling (IT band, quads, hamstrings), and gentle static stretching. Add eccentric hamstring exercises.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Leg Workload',
          description: 'Reduce squat and lunge weight by 20-25%. Increase rest between sets. Focus on tempo control and proper form over load.',
        },
        {
          priority: 'low',
          title: 'Mobility and Recovery',
          description: 'Daily foam rolling for quads, hamstrings, and glutes. Perform 90/90 hip stretches and leg swings. Consider massage gun therapy.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Monitor Right Leg',
          description: 'Continue normal training with proper warm-up. Include 10 minutes of dynamic stretching before leg sessions.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Right Leg Condition',
          description: 'Leg is fully recovered. Ready for high-intensity training. Maintain good recovery practices between sessions.',
        },
      ],
    },
    'left-leg': {
      critical: [
        {
          priority: 'high',
          title: 'Stop All Lower Body Training',
          description: 'Immediate cessation of running, jumping, squatting, and lunging. Possible hamstring or quadriceps strain. Rest and elevate leg. Use compression if swelling present.',
        },
        {
          priority: 'high',
          title: 'Ice and Medical Assessment',
          description: 'Apply ice 20 minutes every 2 hours. Consult sports medicine professional within 24 hours. Muscle tear risk is elevated.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Leg Training Volume',
          description: 'Cut running distance by 50% and avoid high-intensity sprinting. No heavy squats or deadlifts for 3-4 days. Focus on single-leg stability work.',
        },
        {
          priority: 'medium',
          title: 'Hamstring and Quad Protection',
          description: 'Perform dynamic leg swings, foam rolling (IT band, quads, hamstrings), and gentle static stretching. Add eccentric hamstring exercises.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Leg Workload',
          description: 'Reduce squat and lunge weight by 20-25%. Increase rest between sets. Focus on tempo control and proper form over load.',
        },
        {
          priority: 'low',
          title: 'Mobility and Recovery',
          description: 'Daily foam rolling for quads, hamstrings, and glutes. Perform 90/90 hip stretches and leg swings. Consider massage gun therapy.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Monitor Left Leg',
          description: 'Continue normal training with proper warm-up. Include 10 minutes of dynamic stretching before leg sessions.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Left Leg Condition',
          description: 'Leg is fully recovered. Ready for high-intensity training. Maintain good recovery practices between sessions.',
        },
      ],
    },

    // FEET/ANKLES
    'right-foot': {
      critical: [
        {
          priority: 'high',
          title: 'Cease Impact Activities',
          description: 'Stop all running, jumping, and plyometric training immediately. Possible ankle sprain or plantar fasciitis. Use RICE protocol (Rest, Ice, Compression, Elevation).',
        },
        {
          priority: 'high',
          title: 'Ankle Stabilization Required',
          description: 'Wear ankle brace for support. Avoid barefoot walking. Schedule X-ray if severe pain or instability present. Consider crutches if weight-bearing is painful.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Impact Training',
          description: 'Replace running with cycling or swimming for 5-7 days. No jumping or cutting movements. Focus on ankle mobility and strengthening exercises.',
        },
        {
          priority: 'medium',
          title: 'Ankle Rehabilitation',
          description: 'Perform alphabet ankle circles, calf raises (both legs), and balance board exercises. Ice after activity for 15 minutes.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Foot Loading',
          description: 'Reduce running volume by 30%. Focus on proper footwear with adequate cushioning. Perform pre-run ankle warm-ups.',
        },
        {
          priority: 'low',
          title: 'Ankle Strengthening',
          description: 'Add resistance band dorsiflexion, plantarflexion, and eversion exercises. Perform single-leg balance holds daily.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Maintain Foot Health',
          description: 'Continue proper warm-up and footwear selection. Monitor for any discomfort during impact activities.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Right Foot Condition',
          description: 'Ankle and foot are stable and pain-free. Ready for all activities. Consider proprioception training for injury prevention.',
        },
      ],
    },
    'left-foot': {
      critical: [
        {
          priority: 'high',
          title: 'Cease Impact Activities',
          description: 'Stop all running, jumping, and plyometric training immediately. Possible ankle sprain or plantar fasciitis. Use RICE protocol (Rest, Ice, Compression, Elevation).',
        },
        {
          priority: 'high',
          title: 'Ankle Stabilization Required',
          description: 'Wear ankle brace for support. Avoid barefoot walking. Schedule X-ray if severe pain or instability present. Consider crutches if weight-bearing is painful.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Impact Training',
          description: 'Replace running with cycling or swimming for 5-7 days. No jumping or cutting movements. Focus on ankle mobility and strengthening exercises.',
        },
        {
          priority: 'medium',
          title: 'Ankle Rehabilitation',
          description: 'Perform alphabet ankle circles, calf raises (both legs), and balance board exercises. Ice after activity for 15 minutes.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Foot Loading',
          description: 'Reduce running volume by 30%. Focus on proper footwear with adequate cushioning. Perform pre-run ankle warm-ups.',
        },
        {
          priority: 'low',
          title: 'Ankle Strengthening',
          description: 'Add resistance band dorsiflexion, plantarflexion, and eversion exercises. Perform single-leg balance holds daily.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Maintain Foot Health',
          description: 'Continue proper warm-up and footwear selection. Monitor for any discomfort during impact activities.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Left Foot Condition',
          description: 'Ankle and foot are stable and pain-free. Ready for all activities. Consider proprioception training for injury prevention.',
        },
      ],
    },

    // ARMS
    'right-arm': {
      critical: [
        {
          priority: 'high',
          title: 'Stop All Arm Training',
          description: 'Cease all pulling and pressing movements. Possible bicep tendon or elbow tendonitis. Apply ice to elbow and upper arm. Avoid gripping activities.',
        },
        {
          priority: 'high',
          title: 'Elbow Protection Protocol',
          description: 'Wear elbow compression sleeve. Take anti-inflammatory as directed by physician. Schedule evaluation for potential tendon injury.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Arm Volume',
          description: 'Cut all arm exercises by 50% weight and volume. No heavy curls or tricep work. Focus on high-rep (20+) blood flow exercises.',
        },
        {
          priority: 'medium',
          title: 'Elbow and Bicep Recovery',
          description: 'Perform gentle wrist flexor/extensor stretches. Use massage for forearm muscles. Apply heat before training, ice after.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Arm Training',
          description: 'Reduce weight on curls and tricep exercises by 20%. Use slow tempo (3-second eccentric). Avoid exercises causing elbow pain.',
        },
        {
          priority: 'low',
          title: 'Tendon Care',
          description: 'Perform wrist roller exercises and finger flexion/extension work. Ensure proper elbow position during all pressing movements.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Monitor Arm Training',
          description: 'Continue normal arm training with proper warm-up. Pay attention to elbow positioning and avoid excessive volume.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Right Arm Condition',
          description: 'Arm is fully recovered and strong. Ready for progressive overload. Maintain proper form to prevent overuse injuries.',
        },
      ],
    },
    'left-arm': {
      critical: [
        {
          priority: 'high',
          title: 'Stop All Arm Training',
          description: 'Cease all pulling and pressing movements. Possible bicep tendon or elbow tendonitis. Apply ice to elbow and upper arm. Avoid gripping activities.',
        },
        {
          priority: 'high',
          title: 'Elbow Protection Protocol',
          description: 'Wear elbow compression sleeve. Take anti-inflammatory as directed by physician. Schedule evaluation for potential tendon injury.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Arm Volume',
          description: 'Cut all arm exercises by 50% weight and volume. No heavy curls or tricep work. Focus on high-rep (20+) blood flow exercises.',
        },
        {
          priority: 'medium',
          title: 'Elbow and Bicep Recovery',
          description: 'Perform gentle wrist flexor/extensor stretches. Use massage for forearm muscles. Apply heat before training, ice after.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Arm Training',
          description: 'Reduce weight on curls and tricep exercises by 20%. Use slow tempo (3-second eccentric). Avoid exercises causing elbow pain.',
        },
        {
          priority: 'low',
          title: 'Tendon Care',
          description: 'Perform wrist roller exercises and finger flexion/extension work. Ensure proper elbow position during all pressing movements.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Monitor Arm Training',
          description: 'Continue normal arm training with proper warm-up. Pay attention to elbow positioning and avoid excessive volume.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Left Arm Condition',
          description: 'Arm is fully recovered and strong. Ready for progressive overload. Maintain proper form to prevent overuse injuries.',
        },
      ],
    },

    // HANDS
    'right-hand': {
      critical: [
        {
          priority: 'high',
          title: 'Rest Wrist and Hand',
          description: 'Stop all gripping exercises and heavy lifting. Possible wrist sprain or carpal tunnel inflammation. Use wrist splint, especially at night.',
        },
        {
          priority: 'high',
          title: 'Hand Therapy Required',
          description: 'Apply ice to wrist joint. Avoid typing or repetitive hand movements. Schedule evaluation for potential tendon or ligament injury.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Grip Activities',
          description: 'Avoid heavy deadlifts, rows, and pull-ups for 48-72 hours. Use lifting straps if necessary. Focus on wrist mobility exercises.',
        },
        {
          priority: 'medium',
          title: 'Wrist Rehabilitation',
          description: 'Perform wrist circles, flexion/extension stretches, and resistance band wrist curls. Ice after gripping activities.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Grip Training',
          description: 'Reduce weight on pulling movements by 25%. Use fat gripz or thicker implements to distribute pressure. Tape wrist if needed.',
        },
        {
          priority: 'low',
          title: 'Wrist Strengthening',
          description: 'Add wrist curls and reverse wrist curls with light weight. Perform finger extension exercises with rubber bands.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Maintain Wrist Health',
          description: 'Continue normal training. Ensure proper wrist alignment during pressing and pulling movements.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Right Hand Condition',
          description: 'Wrist and hand are strong and stable. Ready for heavy grip work. Consider adding grip strengthening exercises.',
        },
      ],
    },
    'left-hand': {
      critical: [
        {
          priority: 'high',
          title: 'Rest Wrist and Hand',
          description: 'Stop all gripping exercises and heavy lifting. Possible wrist sprain or carpal tunnel inflammation. Use wrist splint, especially at night.',
        },
        {
          priority: 'high',
          title: 'Hand Therapy Required',
          description: 'Apply ice to wrist joint. Avoid typing or repetitive hand movements. Schedule evaluation for potential tendon or ligament injury.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Grip Activities',
          description: 'Avoid heavy deadlifts, rows, and pull-ups for 48-72 hours. Use lifting straps if necessary. Focus on wrist mobility exercises.',
        },
        {
          priority: 'medium',
          title: 'Wrist Rehabilitation',
          description: 'Perform wrist circles, flexion/extension stretches, and resistance band wrist curls. Ice after gripping activities.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Grip Training',
          description: 'Reduce weight on pulling movements by 25%. Use fat gripz or thicker implements to distribute pressure. Tape wrist if needed.',
        },
        {
          priority: 'low',
          title: 'Wrist Strengthening',
          description: 'Add wrist curls and reverse wrist curls with light weight. Perform finger extension exercises with rubber bands.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Maintain Wrist Health',
          description: 'Continue normal training. Ensure proper wrist alignment during pressing and pulling movements.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Left Hand Condition',
          description: 'Wrist and hand are strong and stable. Ready for heavy grip work. Consider adding grip strengthening exercises.',
        },
      ],
    },

    // CORE
    'abdomen': {
      critical: [
        {
          priority: 'high',
          title: 'Stop Core Training',
          description: 'Immediate rest from all abdominal exercises, heavy lifting, and twisting movements. Possible abdominal strain or oblique tear. Apply ice if swelling present.',
        },
        {
          priority: 'high',
          title: 'Medical Evaluation Needed',
          description: 'Consult physician to rule out hernia or severe muscle strain. Avoid valsalva maneuver and bearing down. Rest 5-7 days minimum.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Core Load',
          description: 'Eliminate direct ab exercises and heavy compound lifts for 3-4 days. Focus on breathing exercises and gentle core activation (dead bugs, bird dogs).',
        },
        {
          priority: 'medium',
          title: 'Core Recovery Protocol',
          description: 'Perform diaphragmatic breathing and gentle cat-cow stretches. Avoid rotation and heavy bracing. Use heat for muscle tension relief.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Core Training',
          description: 'Reduce volume of ab exercises by 40%. Focus on anti-rotation exercises (Pallof press). Avoid sit-ups and heavy crunching movements.',
        },
        {
          priority: 'low',
          title: 'Core Stability Work',
          description: 'Add planks (hold time, not reps), dead bugs, and hollow body holds. Ensure proper breathing during compound lifts.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Maintain Core Strength',
          description: 'Continue balanced core training. Include anti-extension, anti-rotation, and anti-lateral flexion exercises.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Core Condition',
          description: 'Core is strong and stable. Ready for progressive overload. Maintain 360-degree core development for injury prevention.',
        },
      ],
    },
    'chest': {
      critical: [
        {
          priority: 'high',
          title: 'Stop All Pressing',
          description: 'Cease bench press, push-ups, and all chest exercises immediately. Possible pectoral strain or costochondral injury. Apply ice to chest.',
        },
        {
          priority: 'high',
          title: 'Medical Assessment Required',
          description: 'Schedule immediate evaluation. Risk of pectoral tear if severe pain present. Avoid deep breathing that causes sharp pain.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Chest Training',
          description: 'No barbell pressing for 5-7 days. Light dumbbell work only if pain-free. Focus on upper back strengthening to balance chest.',
        },
        {
          priority: 'medium',
          title: 'Pectoral Recovery',
          description: 'Perform doorway pec stretches and massage tight chest muscles. Focus on scapular retraction exercises. Ice after any chest work.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Pressing Volume',
          description: 'Reduce chest pressing weight by 30%. Focus on perfect form and controlled tempo. Add extra warm-up sets.',
        },
        {
          priority: 'low',
          title: 'Chest Maintenance',
          description: 'Ensure balanced push-pull ratio (2 pulls for every 1 push). Stretch pectorals 2x daily to prevent tightness.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Monitor Chest Training',
          description: 'Continue normal chest training with proper warm-up. Avoid excessive volume or frequency.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Chest Condition',
          description: 'Chest is recovered and strong. Ready for progressive overload. Maintain shoulder health for long-term pressing capacity.',
        },
      ],
    },

    // HEAD AND NECK
    'head': {
      critical: [
        {
          priority: 'high',
          title: 'URGENT: Seek Medical Attention',
          description: 'Immediate medical evaluation required. Possible concussion or head injury. Stop all physical activity. Monitor for dizziness, nausea, confusion.',
        },
        {
          priority: 'high',
          title: 'Concussion Protocol',
          description: 'Complete rest from all activities. No screens or bright lights. Follow return-to-play protocol only after medical clearance.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Stop All Training',
          description: 'Cease all physical activity until medical evaluation. Possible head trauma or severe headache condition. Rest in dark, quiet environment.',
        },
        {
          priority: 'high',
          title: 'Monitor Symptoms',
          description: 'Track any headaches, vision changes, or cognitive symptoms. Seek emergency care if symptoms worsen.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Reduce Training Intensity',
          description: 'Lower overall training volume by 50%. Avoid contact sports and high-risk activities. Monitor for headaches or cognitive changes.',
        },
        {
          priority: 'medium',
          title: 'Medical Consultation',
          description: 'Schedule evaluation if persistent headaches or discomfort. Ensure proper hydration and sleep quality.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Monitor Head Health',
          description: 'Continue training with proper protective equipment. Avoid unnecessary contact. Report any concerning symptoms immediately.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'No Head Concerns',
          description: 'No head injury risk detected. Continue safe training practices. Use proper protective equipment in contact sports.',
        },
      ],
    },
    'neck': {
      critical: [
        {
          priority: 'high',
          title: 'Stop All Neck Loading',
          description: 'Immediate rest from all exercises involving neck. Possible cervical strain or disc issue. Use neck collar if recommended. Avoid sudden head movements.',
        },
        {
          priority: 'high',
          title: 'Medical Evaluation Required',
          description: 'Schedule evaluation with spine specialist. Monitor for radiating pain, numbness, or tingling in arms. Apply ice to neck.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Reduce Neck Stress',
          description: 'Avoid heavy overhead pressing, shrugs, and head-loaded exercises. Focus on gentle neck mobility (yes/no motions). Use ergonomic pillow.',
        },
        {
          priority: 'medium',
          title: 'Neck Rehabilitation',
          description: 'Perform gentle chin tucks, cervical retractions, and shoulder blade squeezes. Apply heat to tight muscles. Consider massage therapy.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Modify Neck Loading',
          description: 'Reduce weight on overhead movements by 25%. Avoid neck bridges and direct neck training. Focus on posture correction.',
        },
        {
          priority: 'low',
          title: 'Neck Maintenance',
          description: 'Perform daily neck mobility routine. Ensure proper head position during all exercises. Stretch tight upper traps.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Maintain Neck Health',
          description: 'Continue normal training. Perform daily neck mobility work. Maintain good posture throughout the day.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'Optimal Neck Condition',
          description: 'Neck is healthy and mobile. Ready for all activities. Consider adding neck strengthening for injury prevention in contact sports.',
        },
      ],
    },
    'orbit': {
      critical: [
        {
          priority: 'high',
          title: 'URGENT: Eye Injury',
          description: 'Seek immediate medical attention for eye/facial injury. Stop all activity. Apply cold compress gently. Avoid pressure on eye area.',
        },
        {
          priority: 'high',
          title: 'Medical Evaluation Required',
          description: 'Schedule urgent evaluation with ophthalmologist. Monitor vision changes. Protect eye area from further impact.',
        },
      ],
      high: [
        {
          priority: 'high',
          title: 'Stop Contact Activities',
          description: 'Cease all contact sports and high-risk activities. Facial/eye area needs recovery. Apply ice gently. Avoid activities that increase blood pressure to face.',
        },
        {
          priority: 'medium',
          title: 'Protect Face Area',
          description: 'Wear protective eyewear when returning to activity. Monitor for any vision changes or persistent swelling.',
        },
      ],
      medium: [
        {
          priority: 'medium',
          title: 'Reduce Impact Risk',
          description: 'Lower training volume in contact activities by 40%. Wear protective eyewear. Avoid exercises with fall risk.',
        },
        {
          priority: 'low',
          title: 'Monitor Symptoms',
          description: 'Watch for any vision changes, swelling, or discomfort. Apply ice if inflammation present.',
        },
      ],
      low: [
        {
          priority: 'low',
          title: 'Monitor Face Area',
          description: 'Continue training with proper protective equipment. Be cautious in contact situations.',
        },
      ],
      minimal: [
        {
          priority: 'low',
          title: 'No Eye/Face Concerns',
          description: 'No facial injury risk detected. Continue safe training practices. Use protective eyewear in appropriate sports.',
        },
      ],
    },
  };

  // Get recommendations for the specific body part
  const advice = bodyPartAdvice[bodyPart] || {
    [riskLevel]: [
      {
        priority: riskLevel === 'critical' || riskLevel === 'high' ? 'high' : 'medium',
        title: `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk Detected`,
        description: `Monitor ${formatBodyPartName(bodyPart)} closely and adjust training accordingly.`,
      },
    ],
  };

  return advice[riskLevel] || [];
}

module.exports = {
  generateBodyPartRecommendations,
  getBodyPartSpecificAdvice,
};







