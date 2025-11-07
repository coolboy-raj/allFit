"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { User, Trophy, Ruler, Weight, Calendar, Users } from "lucide-react";

interface AthleteFormData {
  name: string;
  age: number;
  position: string;
  height: string;
  weight: string;
  primary_sport: string;
  team: string;
  status: 'active' | 'recovering' | 'injured';
}

interface AthleteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AthleteFormData) => Promise<void>;
  initialData?: Partial<AthleteFormData>;
  mode: 'create' | 'edit';
}

const SPORTS_OPTIONS = [
  'Basketball', 'Soccer', 'Football', 'American Football', 'Rugby',
  'Hockey', 'Ice Hockey', 'Volleyball', 'Baseball', 'Softball',
  'Tennis', 'Badminton', 'Swimming', 'Track and Field', 'Cycling',
  'Boxing', 'MMA', 'Wrestling', 'CrossFit', 'Other'
];

export function AthleteFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}: AthleteFormModalProps) {
  const [formData, setFormData] = useState<AthleteFormData>({
    name: '',
    age: 18,
    position: '',
    height: '',
    weight: '',
    primary_sport: 'Basketball',
    team: '',
    status: 'active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AthleteFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AthleteFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!formData.primary_sport) {
      newErrors.primary_sport = 'Sport is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        age: 18,
        position: '',
        height: '',
        weight: '',
        primary_sport: 'Basketball',
        team: '',
        status: 'active',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting athlete form:', error);
      alert('Failed to save athlete. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof AthleteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'create' ? 'Create New Athlete' : 'Edit Athlete'}
            </h2>
            <p className="text-xs text-gray-400">
              {mode === 'create' ? 'Add athlete profile to start tracking' : 'Update athlete information'}
            </p>
          </div>
        </div>
      }
      description=""
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-gray-300">
            <User className="h-4 w-4 inline mr-1" />
            Athlete Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Michael Jordan"
            className={`bg-gray-900 border-gray-700 text-white ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        {/* Age and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="text-gray-300">
              <Calendar className="h-4 w-4 inline mr-1" />
              Age *
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
              min="1"
              max="120"
              className={`bg-gray-900 border-gray-700 text-white ${errors.age ? 'border-red-500' : ''}`}
            />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </div>

          <div>
            <Label htmlFor="status" className="text-gray-300">
              Status
            </Label>
            <Select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as any)}
              className="bg-gray-900 border-gray-700 text-white"
            >
              <option value="active">Active</option>
              <option value="recovering">Recovering</option>
              <option value="injured">Injured</option>
            </Select>
          </div>
        </div>

        {/* Primary Sport and Position */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sport" className="text-gray-300">
              <Trophy className="h-4 w-4 inline mr-1" />
              Primary Sport *
            </Label>
            <Select
              id="sport"
              value={formData.primary_sport}
              onChange={(e) => handleChange('primary_sport', e.target.value)}
              className={`bg-gray-900 border-gray-700 text-white ${errors.primary_sport ? 'border-red-500' : ''}`}
            >
              {SPORTS_OPTIONS.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </Select>
            {errors.primary_sport && <p className="text-xs text-red-400 mt-1">{errors.primary_sport}</p>}
          </div>

          <div>
            <Label htmlFor="position" className="text-gray-300">
              Position
            </Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              placeholder="e.g., Point Guard"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Height and Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height" className="text-gray-300">
              <Ruler className="h-4 w-4 inline mr-1" />
              Height
            </Label>
            <Input
              id="height"
              value={formData.height}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder={`e.g., 6'3"`}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="weight" className="text-gray-300">
              <Weight className="h-4 w-4 inline mr-1" />
              Weight
            </Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="e.g., 195 lbs"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Team */}
        <div>
          <Label htmlFor="team" className="text-gray-300">
            <Users className="h-4 w-4 inline mr-1" />
            Team / Organization
          </Label>
          <Input
            id="team"
            value={formData.team}
            onChange={(e) => handleChange('team', e.target.value)}
            placeholder="e.g., Chicago Bulls"
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>Saving...</>
            ) : mode === 'create' ? (
              <>Create Athlete</>
            ) : (
              <>Update Athlete</>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AthleteFormModal;

