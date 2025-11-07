"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value?: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  className
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ensure selected is always an array
  const selected = value || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(v => v !== value));
  };

  const getLabel = (value: string) => {
    return options.find(opt => opt.value === value)?.label || value;
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-[40px] w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm cursor-pointer",
          "hover:bg-gray-800 transition-colors",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500",
          isOpen && "ring-2 ring-blue-500"
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selected.map(value => (
              <span
                key={value}
                className="inline-flex items-center gap-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded px-2 py-0.5 text-xs"
              >
                {getLabel(value)}
                <button
                  onClick={(e) => removeOption(value, e)}
                  className="hover:bg-blue-500/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            isOpen && "transform rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-700 bg-gray-900 shadow-lg">
          {options.length === 0 ? (
            <div className="p-2 text-sm text-gray-400 text-center">No options available</div>
          ) : (
            options.map(option => (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm cursor-pointer",
                  "hover:bg-gray-800 transition-colors",
                  selected.includes(option.value) && "bg-blue-600/10"
                )}
              >
                <span className={cn(
                  "text-gray-300",
                  selected.includes(option.value) && "text-blue-300 font-medium"
                )}>
                  {option.label}
                </span>
                {selected.includes(option.value) && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

