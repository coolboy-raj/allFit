"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Activity, 
  Trophy, 
  Calendar, 
  Clock, 
  Timer,
  Heart,
  Flame,
  Target,
  MapPin,
  Users,
  AlertCircle,
  Dumbbell,
  TrendingUp,
  Shield,
  AlertTriangle
} from "lucide-react";
import type { ActivityLog } from "@/lib/injury-analysis/database";

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityLog | null;
  onDelete: (activityId: string) => Promise<void>;
}

export function ActivityDetailModal({ 
  isOpen, 
  onClose, 
  activity, 
  onDelete 
}: ActivityDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!activity) return null;

  // Handle both frontend format (camelCase) and backend format (snake_case)
  const activityData = {
    ...activity,
    activity_type: activity.activity_type || (activity as any).activityType,
    recovery_status: activity.recovery_status || (activity as any).recoveryStatus || 'normal',
    intensity_level: activity.intensity_level || (activity as any).intensityLevel,
    equipment_used: activity.equipment_used || (activity as any).equipmentUsed || [],
    affected_body_parts: activity.affected_body_parts || (activity as any).affectedBodyParts || [],
  };

  const isWorkout = activityData.activity_type === 'workout';
  const isSports = activityData.activity_type === 'sports';

  const handleDelete = async () => {
    if (!activity.id) return;
    
    setIsDeleting(true);
    try {
      await onDelete(activity.id);
      onClose();
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getIntensityColor = (intensity?: string) => {
    switch (intensity) {
      case 'maximum': return 'text-red-500';
      case 'very-hard': return 'text-orange-500';
      case 'hard': return 'text-amber-500';
      case 'moderate': return 'text-yellow-500';
      case 'light': return 'text-green-500';
      case 'very-light': return 'text-emerald-500';
      default: return 'text-gray-400';
    }
  };

  const getRecoveryColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-green-400';
      case 'normal': return 'text-gray-400';
      case 'mild-soreness': return 'text-amber-500';
      case 'significant-fatigue': return 'text-orange-500';
      case 'concerning': return 'text-red-500';
      case 'injured': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          {isWorkout ? (
            <div className="p-2 bg-blue-600 rounded-lg">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
          ) : (
            <div className="p-2 bg-purple-600 rounded-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">
              {isWorkout ? activity.workout_type?.toUpperCase() : activity.sport?.toUpperCase()}
            </h2>
            <p className="text-xs text-gray-400">
              {isWorkout ? 'Workout Session' : 'Sports Activity'} • {formatDate(activity.date)}
            </p>
          </div>
        </div>
      }
      description=""
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Session Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                <Calendar className="h-3 w-3" />
                Date
              </div>
              <p className="text-white font-medium">{new Date(activity.date).toLocaleDateString()}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                <Clock className="h-3 w-3" />
                Start Time
              </div>
              <p className="text-white font-medium">{activity.start_time || 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                <Timer className="h-3 w-3" />
                Duration
              </div>
              <p className="text-white font-medium">{activity.duration} minutes</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                <TrendingUp className="h-3 w-3" />
                Intensity
              </div>
              <p className={`font-medium capitalize ${getIntensityColor(activityData.intensity_level)}`}>
                {activityData.intensity_level?.replace('-', ' ') || 'N/A'}
              </p>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Weather</div>
              <p className="text-white font-medium capitalize">{activity.weather_conditions ? activity.weather_conditions.replace('-', ' ') : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Workout Specific Details */}
        {isWorkout && (
          <>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Exercises {activity.exercises && activity.exercises.length > 0 ? `(${activity.exercises.length})` : '(0)'}
              </h3>
              {activity.exercises && activity.exercises.length > 0 ? (
                <div className="space-y-3">
                  {activity.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="bg-gray-950/50 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{exercise.exercise || 'Unknown Exercise'}</h4>
                        <span className={`text-xs font-medium capitalize ${getIntensityColor(exercise.intensity)}`}>
                          {exercise.intensity || 'N/A'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Sets:</span>
                          <span className="text-white ml-2 font-medium">{exercise.sets || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Reps:</span>
                          <span className="text-white ml-2 font-medium">{exercise.reps || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Weight:</span>
                          <span className="text-white ml-2 font-medium">{exercise.weight ? `${exercise.weight} lbs` : '-'}</span>
                        </div>
                      </div>
                      {exercise.notes && (
                        <p className="text-xs text-gray-400 mt-2 italic">{exercise.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-3">No exercises logged</p>
              )}
            </div>

            {/* Equipment Used */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
                Equipment Used
              </h3>
              {activityData.equipment_used && activityData.equipment_used.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activityData.equipment_used.map((equipment: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-950/30 border border-blue-800/50 rounded-full text-xs text-blue-300"
                    >
                      {equipment?.replace('-', ' ') || equipment}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">No equipment tracked</p>
              )}
            </div>
          </>
        )}

        {/* Sports Specific Details */}
        {isSports && (
          <>
            {/* Match Context */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Match Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Position</div>
                  <p className="text-white font-medium">{activity.position || 'N/A'}</p>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Match Type</div>
                  <p className="text-white font-medium capitalize">{activity.match_type || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </div>
                  <p className="text-white font-medium">{activity.location || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Users className="h-3 w-3" />
                    Opponent
                  </div>
                  <p className="text-white font-medium">{activity.opponent || 'N/A'}</p>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Result</div>
                  <p className="text-white font-medium">{activity.result || 'N/A'}</p>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Minutes Played</div>
                  <p className="text-white font-medium">{activity.minutes_played ? `${activity.minutes_played} min` : 'N/A'}</p>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Surface Type</div>
                  <p className="text-white font-medium capitalize">{activity.surface_type ? activity.surface_type.replace('-', ' ') : 'N/A'}</p>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Medical Attention</div>
                  <p className="text-white font-medium capitalize">{activity.medical_attention ? activity.medical_attention.replace('-', ' ') : 'None'}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-950/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">
                    {activity.performance_metrics?.sprintDistance || '-'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Sprint Distance (m)</p>
                </div>
                <div className="text-center p-3 bg-gray-950/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">
                    {activity.performance_metrics?.topSpeed || '-'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Top Speed (km/h)</p>
                </div>
                <div className="text-center p-3 bg-gray-950/50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {activity.performance_metrics?.jumps || '-'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Jumps</p>
                </div>
                <div className="text-center p-3 bg-gray-950/50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-400">
                    {activity.performance_metrics?.tackles || '-'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Tackles</p>
                </div>
              </div>
            </div>

            {/* Injuries */}
            <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Injuries Reported {activity.injuries && activity.injuries.length > 0 ? `(${activity.injuries.length})` : '(0)'}
              </h3>
              {activity.injuries && activity.injuries.length > 0 ? (
                <div className="space-y-3">
                  {activity.injuries.map((injury: any, index: number) => (
                    <div key={index} className="bg-gray-950/50 rounded-lg p-3 border border-red-700/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white capitalize">{injury.bodyPart?.replace('-', ' ') || 'Unknown'}</h4>
                        <span className={`text-xs font-bold uppercase ${
                          injury.severity === 'severe' ? 'text-red-400' :
                          injury.severity === 'moderate' ? 'text-orange-400' :
                          'text-yellow-400'
                        }`}>
                          {injury.severity || 'N/A'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300"><span className="text-gray-400">Type:</span> {injury.injuryType || 'N/A'}</p>
                        <p className="text-gray-300"><span className="text-gray-400">Time Occurred:</span> {injury.timeOccurred || 'N/A'}</p>
                        <p className="text-gray-300"><span className="text-gray-400">Mechanism:</span> {injury.mechanism || 'N/A'}</p>
                        {injury.notes && (
                          <p className="text-xs text-gray-400 mt-2 italic">{injury.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-3">No injuries reported for this activity</p>
              )}
            </div>
          </>
        )}

        {/* Physiological Data */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Physiological Data
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-950/50 rounded-lg">
              <p className="text-2xl font-bold text-red-400">{activity.heart_rate_avg || '-'}</p>
              <p className="text-xs text-gray-400 mt-1">Avg HR (bpm)</p>
            </div>
            <div className="text-center p-3 bg-gray-950/50 rounded-lg">
              <p className="text-2xl font-bold text-orange-400">{activity.heart_rate_max || '-'}</p>
              <p className="text-xs text-gray-400 mt-1">Max HR (bpm)</p>
            </div>
            <div className="text-center p-3 bg-gray-950/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-5 w-5 text-amber-400" />
                <p className="text-2xl font-bold text-amber-400">{activity.calories_burned || '-'}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">Calories</p>
            </div>
          </div>
        </div>

        {/* Recovery & Fatigue */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Recovery Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-xs mb-1">Recovery Status</div>
              <p className={`font-medium capitalize ${getRecoveryColor(activityData.recovery_status)}`}>
                {activityData.recovery_status?.replace('-', ' ') || 'Normal'}
              </p>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Fatigue Level</div>
              {activity.fatigue_level ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                      style={{ width: `${activity.fatigue_level * 10}%` }}
                    />
                  </div>
                  <span className="text-white font-medium">{activity.fatigue_level}/10</span>
                </div>
              ) : (
                <p className="text-white font-medium">N/A</p>
              )}
            </div>
          </div>
        </div>

        {/* Affected Body Parts */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Affected Body Parts
          </h3>
          {activityData.affected_body_parts && activityData.affected_body_parts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activityData.affected_body_parts.map((part: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-950/30 border border-purple-800/50 rounded-full text-xs text-purple-300 capitalize"
                >
                  {part?.replace('-', ' ') || part}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-2">No affected body parts tracked</p>
          )}
        </div>

        {/* Notes */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Notes & Feedback
          </h3>
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1">Performance Notes:</p>
            <p className="text-sm text-gray-300">{activity.notes || 'No notes provided'}</p>
          </div>
          {isSports && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Coach Feedback:</p>
              <p className="text-sm text-gray-300">{activity.coach_feedback || 'No feedback provided'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        {!showDeleteConfirm ? (
          <>
            <Button 
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-400 border-red-800 hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Activity
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Are you sure? This cannot be undone.</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="gradient"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Timer className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Confirm Delete
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default ActivityDetailModal;
