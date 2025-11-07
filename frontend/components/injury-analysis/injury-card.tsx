"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, AlertTriangle } from "lucide-react";

export interface InjuryEntry {
  id: string;
  bodyPart: string;
  injuryType: string;
  severity: string;
  timeOccurred: string; // e.g., "23' (23rd minute)"
  mechanism: string; // How it happened
  notes: string;
}

interface InjuryCardProps {
  injury: InjuryEntry;
  onUpdate: (field: keyof InjuryEntry, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const BODY_PART_OPTIONS = [
  { value: "", label: "Select body part..." },
  { value: "head", label: "Head" },
  { value: "orbit", label: "Face/Eyes" },
  { value: "neck", label: "Neck" },
  { value: "chest", label: "Chest" },
  { value: "abdomen", label: "Abdomen" },
  { value: "right-shoulder", label: "Right Shoulder" },
  { value: "left-shoulder", label: "Left Shoulder" },
  { value: "right-arm", label: "Right Arm/Elbow" },
  { value: "left-arm", label: "Left Arm/Elbow" },
  { value: "right-hand", label: "Right Hand/Wrist" },
  { value: "left-hand", label: "Left Hand/Wrist" },
  { value: "right-leg", label: "Right Leg (Upper)" },
  { value: "left-leg", label: "Left Leg (Upper)" },
  { value: "right-foot", label: "Right Foot/Ankle" },
  { value: "left-foot", label: "Left Foot/Ankle" },
];

const INJURY_TYPE_OPTIONS = [
  { value: "", label: "Select type..." },
  { value: "strain", label: "Strain (Muscle)" },
  { value: "sprain", label: "Sprain (Ligament)" },
  { value: "contusion", label: "Contusion (Bruise)" },
  { value: "laceration", label: "Laceration (Cut)" },
  { value: "fracture", label: "Fracture (Suspected)" },
  { value: "dislocation", label: "Dislocation" },
  { value: "concussion", label: "Concussion" },
  { value: "cramp", label: "Cramp" },
  { value: "tendonitis", label: "Tendonitis" },
  { value: "impact", label: "Impact Injury" },
  { value: "overuse", label: "Overuse" },
  { value: "other", label: "Other" },
];

const SEVERITY_OPTIONS = [
  { value: "minor", label: "Minor", color: "text-yellow-400" },
  { value: "moderate", label: "Moderate", color: "text-orange-400" },
  { value: "severe", label: "Severe", color: "text-red-400" },
];

const MECHANISM_OPTIONS = [
  { value: "", label: "Select mechanism..." },
  { value: "contact-player", label: "Contact with Player" },
  { value: "contact-ground", label: "Contact with Ground" },
  { value: "contact-equipment", label: "Contact with Equipment" },
  { value: "non-contact", label: "Non-Contact" },
  { value: "overexertion", label: "Overexertion" },
  { value: "twist", label: "Twisting Motion" },
  { value: "landing", label: "Poor Landing" },
  { value: "sudden-movement", label: "Sudden Movement" },
  { value: "fatigue", label: "Fatigue Related" },
];

export function InjuryCard({ injury, onUpdate, onRemove, canRemove }: InjuryCardProps) {
  const severityColor = SEVERITY_OPTIONS.find(s => s.value === injury.severity)?.color || "text-gray-400";
  
  // Dynamic colors based on severity
  const getSeverityStyles = () => {
    switch (injury.severity) {
      case "minor":
        return {
          bg: "bg-gradient-to-br from-yellow-950/20 to-amber-950/20",
          border: "border-yellow-900/30 hover:border-yellow-700/50",
          icon: "text-yellow-400",
          buttonBg: "bg-yellow-950/50 hover:bg-yellow-900/50",
          buttonBorder: "border-yellow-800/50",
          buttonText: "text-yellow-400 group-hover:text-yellow-300"
        };
      case "moderate":
        return {
          bg: "bg-gradient-to-br from-orange-950/20 to-red-950/20",
          border: "border-orange-900/30 hover:border-orange-700/50",
          icon: "text-orange-400",
          buttonBg: "bg-orange-950/50 hover:bg-orange-900/50",
          buttonBorder: "border-orange-800/50",
          buttonText: "text-orange-400 group-hover:text-orange-300"
        };
      case "severe":
        return {
          bg: "bg-gradient-to-br from-red-950/30 to-rose-950/30",
          border: "border-red-900/50 hover:border-red-700/70",
          icon: "text-red-400",
          buttonBg: "bg-red-950/50 hover:bg-red-900/50",
          buttonBorder: "border-red-800/50",
          buttonText: "text-red-400 group-hover:text-red-300"
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-950/20 to-gray-900/20",
          border: "border-gray-800/30 hover:border-gray-700/50",
          icon: "text-gray-400",
          buttonBg: "bg-gray-950/50 hover:bg-gray-900/50",
          buttonBorder: "border-gray-800/50",
          buttonText: "text-gray-400 group-hover:text-gray-300"
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`relative ${styles.bg} border ${styles.border} rounded-lg p-4 transition-all`}>
      {/* Remove Button */}
      {canRemove && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 p-1.5 ${styles.buttonBg} border ${styles.buttonBorder} rounded-md transition-colors group`}
          title="Remove injury"
        >
          <X className={`h-3.5 w-3.5 ${styles.buttonText}`} />
        </button>
      )}

      {/* Header with Severity Badge */}
      <div className="flex items-center gap-2 mb-4 mr-10">
        <AlertTriangle className={`h-4 w-4 ${styles.icon}`} />
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
          Injury #{injury.id.slice(0, 4)}
        </span>
        {injury.severity && (
          <span className={`text-xs font-bold ${severityColor} ml-auto`}>
            {SEVERITY_OPTIONS.find(s => s.value === injury.severity)?.label}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Body Part & Injury Type */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] text-gray-400 uppercase">Body Part</Label>
            <Select
              value={injury.bodyPart}
              onChange={(e) => onUpdate("bodyPart", e.target.value)}
              className="bg-gray-950/50 border-gray-700 text-sm h-9"
            >
              {BODY_PART_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] text-gray-400 uppercase">Type</Label>
            <Select
              value={injury.injuryType}
              onChange={(e) => onUpdate("injuryType", e.target.value)}
              className="bg-gray-950/50 border-gray-700 text-sm h-9"
            >
              {INJURY_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Severity & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] text-gray-400 uppercase">Severity</Label>
            <Select
              value={injury.severity}
              onChange={(e) => onUpdate("severity", e.target.value)}
              className="bg-gray-950/50 border-gray-700 text-sm h-9"
            >
              <option value="">Select...</option>
              {SEVERITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] text-gray-400 uppercase">Time (min)</Label>
            <Input
              value={injury.timeOccurred}
              onChange={(e) => onUpdate("timeOccurred", e.target.value)}
              placeholder="45'"
              className="bg-gray-950/50 border-gray-700 text-sm h-9"
            />
          </div>
        </div>

        {/* Mechanism */}
        <div className="space-y-1.5">
          <Label className="text-[10px] text-gray-400 uppercase">Mechanism</Label>
          <Select
            value={injury.mechanism}
            onChange={(e) => onUpdate("mechanism", e.target.value)}
            className="bg-gray-950/50 border-gray-700 text-sm h-9"
          >
            {MECHANISM_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label className="text-[10px] text-gray-400 uppercase">Notes</Label>
          <Textarea
            value={injury.notes}
            onChange={(e) => onUpdate("notes", e.target.value)}
            placeholder="Details about the injury..."
            rows={2}
            className="bg-gray-950/50 border-gray-700 text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}

