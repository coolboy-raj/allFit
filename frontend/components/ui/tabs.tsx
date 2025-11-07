"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  defaultValue?: string;
  value?: string;  // Controlled value
  onValueChange?: (value: string) => void;  // Controlled change handler
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: "",
  setActiveTab: () => {},
});

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  // Support both controlled and uncontrolled modes
  const [internalTab, setInternalTab] = React.useState(defaultValue || value || "");
  
  // Use controlled value if provided, otherwise use internal state
  const activeTab = value !== undefined ? value : internalTab;
  
  const setActiveTab = React.useCallback((newValue: string) => {
    // If controlled, call the onChange handler
    if (onValueChange) {
      onValueChange(newValue);
    }
    // Always update internal state for uncontrolled mode
    if (value === undefined) {
      setInternalTab(newValue);
    }
  }, [value, onValueChange]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-white/5 p-1 w-full",
      className
    )}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 flex-1",
        isActive
          ? "bg-black text-white"
          : "text-white/50 hover:text-white/80",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = React.useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <div className={cn("mt-6", className)}>
      {children}
    </div>
  );
}

