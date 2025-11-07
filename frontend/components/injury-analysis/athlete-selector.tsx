"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Plus, Edit, Trash2, CheckCircle } from "lucide-react";
import type { Athlete } from "@/lib/injury-analysis/database";

interface AthleteSelectorProps {
  athletes: Athlete[];
  selectedAthlete: Athlete | null;
  onSelectAthlete: (athlete: Athlete) => void;
  onCreateAthlete: () => void;
  onEditAthlete: (athlete: Athlete) => void;
  onDeleteAthlete: (athlete: Athlete) => void;
}

export function AthleteSelector({
  athletes,
  selectedAthlete,
  onSelectAthlete,
  onCreateAthlete,
  onEditAthlete,
  onDeleteAthlete,
}: AthleteSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-400";
      case "recovering": return "bg-amber-400";
      case "injured": return "bg-red-400";
      default: return "bg-white/30";
    }
  };

  return (
    <div className="relative">
      {/* Selected Athlete Display */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between bg-white/[0.10] border-white/10 text-white hover:bg-white/5 hover:border-white/20 h-[47]"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-400 border border-blue-500/20">
            {selectedAthlete ? selectedAthlete.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">
              {selectedAthlete ? selectedAthlete.name : 'Select Athlete'}
            </p>
            {selectedAthlete && (
              <p className="text-xs text-white/50">
                {selectedAthlete.primary_sport} • {selectedAthlete.position || 'No position'}
              </p>
            )}
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-white/10 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Athletes List */}
            <div className="p-2">
              {athletes.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-blue-400" />
                  </div>
                  <p className="text-sm text-white/50 mb-4">No athletes yet</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      onCreateAthlete();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Athlete
                  </Button>
                </div>
              ) : (
                <>
                  {athletes.map((athlete) => (
                    <div
                      key={athlete.id}
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors ${
                        selectedAthlete?.id === athlete.id ? 'bg-white/[0.03] border border-blue-500/30' : ''
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectAthlete(athlete);
                          setIsOpen(false);
                        }}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        {/* Avatar */}
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-400 border border-blue-500/20">
                            {athlete.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black ${getStatusColor(athlete.status)}`} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white truncate">
                              {athlete.name}
                            </p>
                            {selectedAthlete?.id === athlete.id && (
                              <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-white/50 truncate">
                            {athlete.primary_sport} 
                            {athlete.position && ` • ${athlete.position}`}
                            {athlete.team && ` • ${athlete.team}`}
                          </p>
                        </div>
                      </button>

                      {/* Action Buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            onEditAthlete(athlete);
                          }}
                          className="p-1.5 hover:bg-white/5 rounded text-white/50 hover:text-blue-400"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {athletes.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete ${athlete.name}? This will also delete all their activity data.`)) {
                                onDeleteAthlete(athlete);
                              }
                            }}
                            className="p-1.5 hover:bg-white/5 rounded text-white/50 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add New Athlete Button */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onCreateAthlete();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 mt-2 text-sm text-blue-400 hover:bg-white/5 rounded-lg transition-colors border-t border-white/5 pt-3 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Athlete
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AthleteSelector;

