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
      case "active": return "bg-green-500";
      case "recovering": return "bg-amber-500";
      case "injured": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="relative">
      {/* Selected Athlete Display */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between bg-gray-900 border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            {selectedAthlete ? selectedAthlete.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">
              {selectedAthlete ? selectedAthlete.name : 'Select Athlete'}
            </p>
            {selectedAthlete && (
              <p className="text-xs text-gray-400">
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
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Athletes List */}
            <div className="p-2">
              {athletes.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 mb-4">No athletes yet</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      onCreateAthlete();
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
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
                      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
                        selectedAthlete?.id === athlete.id ? 'bg-gray-800 border border-blue-500' : ''
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
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-sm font-bold text-white">
                            {athlete.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-gray-900 ${getStatusColor(athlete.status)}`} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white truncate">
                              {athlete.name}
                            </p>
                            {selectedAthlete?.id === athlete.id && (
                              <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">
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
                          className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400"
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
                            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
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
                    className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-sm text-blue-400 hover:bg-gray-800 rounded-lg transition-colors border-t border-gray-800 pt-3"
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

