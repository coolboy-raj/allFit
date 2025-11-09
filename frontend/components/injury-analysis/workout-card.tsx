"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Trash2, GripVertical } from "lucide-react";
import { EXERCISE_DATABASE, INTENSITY_LEVELS } from "@/lib/injury-analysis/constants";

export interface WorkoutExercise {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  intensity: string;
  notes: string;
}

interface WorkoutCardProps {
  workout: WorkoutExercise;
  index: number;
  onUpdate: (id: string, field: keyof WorkoutExercise, value: any) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function WorkoutCard({ workout, index, onUpdate, onRemove, canRemove }: WorkoutCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle & Remove Button */}
      <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="p-1 text-gray-600 hover:text-gray-400 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(workout.id)}
            className="p-1 text-red-600 hover:text-red-400 transition-colors"
            title="Remove workout"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Workout Number */}
      <div className="absolute -top-3 -left-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-gray-950">
        {index + 1}
      </div>

      <div className="space-y-3 mt-2">
        {/* Exercise Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-400 font-medium">Exercise</Label>
          <Select
            value={workout.exercise}
            onChange={(e) => onUpdate(workout.id, "exercise", e.target.value)}
            className="bg-gray-950/50 border-gray-700"
          >
            <option value="">Select exercise...</option>
            {EXERCISE_DATABASE.map((ex) => (
              <option key={ex.name} value={ex.name}>
                {ex.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Sets, Reps, Weight Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400 font-medium">Sets</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={workout.sets}
              onChange={(e) => onUpdate(workout.id, "sets", parseInt(e.target.value) || 1)}
              className="bg-gray-950/50 border-gray-700 text-center"
              placeholder="3"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400 font-medium">Reps</Label>
            <Input
              type="number"
              min="1"
              max="100"
              value={workout.reps}
              onChange={(e) => onUpdate(workout.id, "reps", parseInt(e.target.value) || 1)}
              className="bg-gray-950/50 border-gray-700 text-center"
              placeholder="10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400 font-medium">Weight</Label>
            <Input
              type="number"
              min="0"
              step="5"
              value={workout.weight}
              onChange={(e) => onUpdate(workout.id, "weight", parseInt(e.target.value) || 0)}
              className="bg-gray-950/50 border-gray-700 text-center"
              placeholder="0"
            />
          </div>
        </div>

        {/* Intensity */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-400 font-medium">Intensity</Label>
          <Select
            value={workout.intensity}
            onChange={(e) => onUpdate(workout.id, "intensity", e.target.value)}
            className="bg-gray-950/50 border-gray-700"
          >
            {INTENSITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-400 font-medium">Notes (Optional)</Label>
          <Input
            type="text"
            value={workout.notes}
            onChange={(e) => onUpdate(workout.id, "notes", e.target.value)}
            className="bg-gray-950/50 border-gray-700"
            placeholder="Form notes, RPE, etc..."
          />
        </div>
      </div>
    </div>
  );
}









