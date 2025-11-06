"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InjuryRisk } from "@/types";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { getRiskColor } from "@/lib/utils";

interface InjuryRiskCardProps {
  injuryRisk: InjuryRisk;
}

export function InjuryRiskCard({ injuryRisk }: InjuryRiskCardProps) {
  const riskColor = getRiskColor(injuryRisk.level);

  const getRiskIcon = () => {
    switch (injuryRisk.level) {
      case "LOW":
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case "MEDIUM":
        return <Shield className="h-8 w-8 text-yellow-600" />;
      case "HIGH":
        return <AlertTriangle className="h-8 w-8 text-red-600" />;
    }
  };

  const getRiskBg = () => {
    switch (injuryRisk.level) {
      case "LOW":
        return "bg-green-100";
      case "MEDIUM":
        return "bg-yellow-100";
      case "HIGH":
        return "bg-red-100";
    }
  };

  const getRiskDescription = () => {
    switch (injuryRisk.level) {
      case "LOW":
        return "Your training patterns look healthy";
      case "MEDIUM":
        return "Monitor your training intensity";
      case "HIGH":
        return "Take action to prevent injury";
    }
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Injury Risk</CardTitle>
          {getRiskIcon()}
        </div>
        <CardDescription>AI-powered injury prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Risk Level Display */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center h-24 w-24 rounded-full ${getRiskBg()}`}>
              <div className={`text-2xl font-bold ${riskColor}`}>
                {injuryRisk.level}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {getRiskDescription()}
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    injuryRisk.level === "LOW" 
                      ? "bg-green-600" 
                      : injuryRisk.level === "MEDIUM" 
                      ? "bg-yellow-600" 
                      : "bg-red-600"
                  }`}
                  style={{ width: `${injuryRisk.score}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Risk Score: {injuryRisk.score}/100
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          {injuryRisk.factors?.length > 0 && (
            <div className="pt-4 border-t dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Key Factors:
              </h4>
              <ul className="space-y-1">
                {injuryRisk.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                      injuryRisk.level === "LOW" 
                        ? "bg-green-600" 
                        : injuryRisk.level === "MEDIUM" 
                        ? "bg-yellow-600" 
                        : "bg-red-600"
                    }`} />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations Preview */}
          {injuryRisk.recommendations?.length > 0 && injuryRisk.level !== "LOW" && (
            <div className="pt-4 border-t dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Quick Tips:
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {injuryRisk.recommendations[0]}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

