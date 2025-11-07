"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { AlertTriangle, TrendingUp, CheckCircle, Info } from "lucide-react";

export type BodyPart = 
  | "head" 
  | "orbit" 
  | "neck" 
  | "chest" 
  | "right-shoulder" 
  | "right-arm" 
  | "right-hand" 
  | "left-shoulder" 
  | "left-arm" 
  | "left-hand" 
  | "abdomen" 
  | "right-leg" 
  | "right-foot" 
  | "left-leg" 
  | "left-foot";

interface HumanAnatomyProps {
  onBodyPartClick?: (part: BodyPart) => void;
  highlightedParts?: BodyPart[];
  injuryRiskParts?: { part: BodyPart; risk: "low" | "medium" | "high" | "critical" | "injured"; percentage: number; message: string; isInjured?: boolean }[];
}

export function HumanAnatomy({ 
  onBodyPartClick, 
  highlightedParts = [],
  injuryRiskParts = []
}: HumanAnatomyProps) {
  const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [clickedPart, setClickedPart] = useState<BodyPart | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getColorByPercentage = (percentage: number, isInjured?: boolean) => {
    // Purple for injured status - takes priority
    if (isInjured) return "#a855f7"; // purple-500 - INJURED
    
    if (percentage >= 80) return "#dc2626"; // red-600 - Critical
    if (percentage >= 70) return "#ef4444"; // red-500 - Very High
    if (percentage >= 60) return "#f87171"; // red-400 - High
    if (percentage >= 50) return "#f97316"; // orange-500 - Medium-High
    if (percentage >= 40) return "#fb923c"; // orange-400 - Medium
    if (percentage >= 30) return "#f59e0b"; // amber-500 - Medium-Low
    if (percentage >= 20) return "#fbbf24"; // amber-400 - Low-Medium
    if (percentage >= 10) return "#facc15"; // yellow-400 - Low
    if (percentage >= 5) return "#a3e635"; // lime-400 - Very Low
    return "#22c55e"; // green-500 - Minimal
  };

  const getRiskColor = (part: BodyPart) => {
    const riskData = injuryRiskParts.find(item => item.part === part);
    if (!riskData) return "#D9D9D9";
    
    return getColorByPercentage(riskData.percentage, riskData.isInjured);
  };

  const getRiskData = (part: BodyPart) => {
    return injuryRiskParts.find(item => item.part === part);
  };

  const getRiskLevel = (percentage: number, isInjured?: boolean) => {
    if (isInjured) return { label: "INJURED", color: "#a855f7", icon: AlertTriangle };
    if (percentage >= 70) return { label: "CRITICAL", color: "#dc2626", icon: AlertTriangle };
    if (percentage >= 50) return { label: "HIGH RISK", color: "#f97316", icon: AlertTriangle };
    if (percentage >= 30) return { label: "MODERATE", color: "#f59e0b", icon: TrendingUp };
    if (percentage >= 10) return { label: "LOW RISK", color: "#facc15", icon: Info };
    return { label: "MINIMAL", color: "#22c55e", icon: CheckCircle };
  };

  const handleMouseMove = (e: React.MouseEvent, part: BodyPart) => {
    setHoveredPart(part);
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get scroll position
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Tooltip dimensions (estimated)
    const tooltipWidth = getRiskData(part) ? 340 : 300;
    const tooltipHeight = getRiskData(part) ? 380 : 260;
    
    // Offset from cursor
    const offsetX = 15;
    const offsetY = 15;
    
    // Calculate position (client coordinates, not page coordinates)
    let x = e.clientX + offsetX;
    let y = e.clientY + offsetY;
    
    // Adjust if tooltip goes off right edge
    if (x + tooltipWidth > viewportWidth - 10) {
      x = e.clientX - tooltipWidth - offsetX;
    }
    
    // Adjust if tooltip goes off bottom edge
    if (y + tooltipHeight > viewportHeight - 10) {
      y = e.clientY - tooltipHeight - offsetY;
    }
    
    // Ensure minimum distance from left edge
    if (x < 10) {
      x = 10;
    }
    
    // Ensure minimum distance from top edge
    if (y < 10) {
      y = 10;
    }
    
    setTooltipPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredPart(null);
  };

  const getBodyPartLabel = (part: BodyPart) => {
    return part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const isHighlighted = (part: BodyPart) => {
    return highlightedParts.includes(part) || hoveredPart === part || clickedPart === part;
  };

  const handlePartClick = (part: BodyPart) => {
    setClickedPart(part);
    onBodyPartClick?.(part);
  };

  const shouldPulse = (part: BodyPart) => {
    const riskData = getRiskData(part);
    // Pulse for both high risk and injured parts
    return riskData && (riskData.percentage >= 60 || riskData.isInjured);
  };

  const partClass = (part: BodyPart) => cn(
    "absolute left-1/2 transition-all duration-300 ease-out",
    "cursor-pointer transform-gpu",
    isHighlighted(part) && "scale-105",
    shouldPulse(part) && "animate-pulse-slow",
    hoveredPart === part && "z-50"
  );

  const pathClass = (part: BodyPart) => {
    const riskData = getRiskData(part);
    const isInjured = riskData?.isInjured;
    
    return cn(
      "transition-all duration-300 ease-out",
      isHighlighted(part) && "brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]",
      clickedPart === part && "drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]",
      // Special purple glow for injured parts
      isInjured && "drop-shadow-[0_0_15px_rgba(168,85,247,0.9)] brightness-125"
    );
  };

  // Tooltip component
  const tooltipContent = hoveredPart && (
    <div 
      className="fixed pointer-events-none"
      style={{ 
        left: `${tooltipPosition.x}px`, 
        top: `${tooltipPosition.y}px`,
        zIndex: 999999,
        maxWidth: 'min(340px, calc(100vw - 20px))',
        maxHeight: 'calc(100vh - 20px)'
      }}
    >
          <div className="relative animate-in fade-in zoom-in-95 duration-200">
            {/* Glow effect */}
            <div 
              className="absolute inset-0 blur-xl opacity-40 rounded-2xl pointer-events-none"
              style={{ 
                backgroundColor: getRiskColor(hoveredPart),
              }}
            />
            
            {getRiskData(hoveredPart) ? (
              /* Tooltip with data */
              <div 
                className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl border-2 backdrop-blur-sm w-[320px] injury-tooltip"
                style={{ 
                  borderColor: getRiskColor(hoveredPart) + '80',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  overflowX: 'hidden'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-base text-white mb-1">
                      {getBodyPartLabel(hoveredPart)}
                    </h4>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const riskData = getRiskData(hoveredPart)!;
                        const riskLevel = getRiskLevel(riskData.percentage, riskData.isInjured);
                        const Icon = riskLevel.icon;
                        return (
                          <>
                            <Icon className="w-3.5 h-3.5" style={{ color: riskLevel.color }} />
                            <span 
                              className="text-xs font-bold uppercase tracking-wide"
                              style={{ color: riskLevel.color }}
                            >
                              {riskLevel.label}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* Large percentage badge */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="text-3xl font-black leading-none"
                      style={{ color: getRiskColor(hoveredPart) }}
                    >
                      {getRiskData(hoveredPart)?.percentage}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-out relative"
                      style={{ 
                        width: `${getRiskData(hoveredPart)?.percentage}%`,
                        backgroundColor: getRiskColor(hoveredPart),
                      }}
                    >
                      {/* Animated shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  {/* Scale markers */}
                  <div className="flex justify-between mt-1 px-0.5">
                    <span className="text-[9px] text-gray-600">0</span>
                    <span className="text-[9px] text-gray-600">25</span>
                    <span className="text-[9px] text-gray-600">50</span>
                    <span className="text-[9px] text-gray-600">75</span>
                    <span className="text-[9px] text-gray-600">100</span>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {getRiskData(hoveredPart)?.message}
                  </p>
                </div>

                {/* Click hint */}
                <div className="mt-3 pt-2 border-t border-gray-800">
                  <p className="text-[10px] text-gray-500 text-center">
                    Click for detailed analysis
                  </p>
                </div>
              </div>
            ) : (
              /* Simple tooltip without data */
              <div 
                className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-gray-700 backdrop-blur-sm w-[280px] injury-tooltip"
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  overflowX: 'hidden'
                }}
              >
                {/* Header */}
                <div className="mb-3">
                  <h4 className="font-bold text-base text-white mb-1">
                    {getBodyPartLabel(hoveredPart)}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      NO DATA
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Log workout or sports activities to analyze injury risk for this body part.
                  </p>
                </div>

                {/* Action hint */}
                <div className="mt-3 pt-2 border-t border-gray-800">
                  <p className="text-[10px] text-blue-400 text-center font-medium">
                    Click "Log New Activity" to start tracking
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
  );

  return (
    <>
      {/* Render tooltip to document.body using portal */}
      {mounted && tooltipContent && createPortal(tooltipContent, document.body)}
      
      <div className="relative mx-auto block" style={{ height: "850px", width: "300px" }}>
      {/* Head */}
      <svg 
        id="head" 
        className={partClass("head")}
        style={{ marginLeft: "-27px", top: "-6px" }}
        width="80.3" 
        height="100" 
        viewBox="0 0 181 250" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "head")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("head")}
      >
        <path 
          className={pathClass("head")}
          d="M12.6756 53L11.663 110.643L0 109.49L3 142L18.663 148L30.6756 198L62.6756 250H120.676L156.676 198L164.676 143L178.676 132L180.676 103L169.676 104L168.676 49.0808C168.676 49.0808 125.105 -0.230752 88.6756 0.999954C52.7339 2.21418 12.6756 53 12.6756 53Z" 
          fill={getRiskColor("head")}
        />
      </svg>
      
      {/* Orbit/Eyes */}
      <svg 
        id="orbit" 
        className={partClass("orbit")}
        style={{ marginLeft: "-6px", top: "27px" }}
        width="40" 
        height="10" 
        viewBox="0 0 96 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "orbit")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("orbit")}
      >
        <ellipse cx="15" cy="10" rx="15" ry="10" fill="#EEEEEE"/>
        <ellipse cx="81" cy="10" rx="15" ry="10" fill="#EEEEEE"/>
      </svg>

      {/* Neck */}
      <svg 
        id="neck" 
        className={partClass("neck")}
        style={{ marginLeft: "-21px", top: "70px" }}
        width="70" 
        height="80" 
        viewBox="0 0 149 126" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "neck")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("neck")}
      >
        <path className={pathClass("neck")} d="M10.2703 0L52.2973 53.9L76 126L28.7568 111.3L0 27.3L10.2703 0Z" fill={getRiskColor("neck")}/>
        <path className={pathClass("neck")} d="M142 0L149 16L126 98L82 126L96 56L142 0Z" fill={getRiskColor("neck")}/>
      </svg>

      {/* Chest */}
      <svg 
        id="chest" 
        className={partClass("chest")}
        style={{ marginLeft: "-57px", top: "140px" }}
        width="150" 
        height="80" 
        viewBox="0 0 289 165" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "chest")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("chest")}
      >
        <path className={pathClass("chest")} d="M53 0L114 13L132 121L71 165L23 148V97L0 70L35 55L53 0Z" fill={getRiskColor("chest")}/>
        <path className={pathClass("chest")} d="M221 0L252 50.2069H289L277 76V128L227 162L160.407 116L166.407 10.2069L221 0Z" fill={getRiskColor("chest")}/>
      </svg>
      
      {/* Right Shoulder */}
      <svg 
        id="right-shoulder" 
        className={partClass("right-shoulder")}
        style={{ marginLeft: "-90px", top: "100px" }}
        width="75" 
        height="110" 
        viewBox="0 0 154 218" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "right-shoulder")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("right-shoulder")}
      >
        <path className={pathClass("right-shoulder")} d="M135 0L154 52H105L73 36L135 0Z" fill={getRiskColor("right-shoulder")}/>
        <path className={pathClass("right-shoulder")} d="M35 51H53.916L0 151.214V107L35 51Z" fill={getRiskColor("right-shoulder")}/>
        <path className={pathClass("right-shoulder")} d="M58.916 55.2145H99.916L74.916 142.214L35.916 165.214L4.91602 217.214V155.214L58.916 55.2145Z" fill={getRiskColor("right-shoulder")}/>
      </svg>

      {/* Right Arm */}
      <svg 
        id="right-arm" 
        className={partClass("right-arm")}
        style={{ marginLeft: "-162px", top: "210px" }}
        width="100" 
        height="190" 
        viewBox="0 0 223 445" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "right-arm")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("right-arm")}
      >
        <path className={pathClass("right-arm")} d="M193 0L223 42L183 167L104 200V181L160 48L193 0Z" fill={getRiskColor("right-arm")}/>
        <path className={pathClass("right-arm")} d="M144 14L98 191L110 69L144 14Z" fill={getRiskColor("right-arm")}/>
        <path className={pathClass("right-arm")} d="M181 175L172 203L106 242V212L181 175Z" fill={getRiskColor("right-arm")}/>
        <path className={pathClass("right-arm")} d="M90 210L100 256L18 432L0 422L36 302L90 210Z" fill={getRiskColor("right-arm")}/>
        <path className={pathClass("right-arm")} d="M163 234L149 295L48 445L25 439L114 253L163 234Z" fill={getRiskColor("right-arm")}/>
      </svg>

      {/* Right Hand */}
      <svg 
        id="right-hand" 
        className={partClass("right-hand")}
        style={{ marginLeft: "-197px", top: "387px" }}
        width="60" 
        height="90" 
        viewBox="0 0 127 170" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "right-hand")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("right-hand")}
      >
        <path className={pathClass("right-hand")} d="M70 0L85 27L123 32C123 32 124.421 62.7655 126 83C128.63 116.709 111 170 111 170H100L107 131L96 126L83 167L70 165L81 119L72 113L55 158L41 157L58 106L49 101L27 151L17 149L41 66L37 53L6 73L0 66L27 27L70 0Z" fill={getRiskColor("right-hand")}/>
      </svg>

      {/* Left Shoulder */}
      <svg 
        id="left-shoulder" 
        className={partClass("left-shoulder")}
        style={{ marginLeft: "48px", top: "95px" }}
        width="100" 
        height="110" 
        viewBox="0 0 193 210" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "left-shoulder")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("left-shoulder")}
      >
        <path className={pathClass("left-shoulder")} d="M87 65L185 141L193 210L163 173L113 155L53 101L87 65Z" fill={getRiskColor("left-shoulder")}/>
        <path className={pathClass("left-shoulder")} d="M111 48L179 106L191 141L93 57L111 48Z" fill={getRiskColor("left-shoulder")}/>
        <path className={pathClass("left-shoulder")} d="M11 0L95 50L63 64L0 50L11 0Z" fill={getRiskColor("left-shoulder")}/>
      </svg>

      {/* Left Arm */}
      <svg 
        id="left-arm" 
        className={partClass("left-arm")}
        style={{ marginLeft: "100px", top: "202px" }}
        width="100" 
        height="190" 
        viewBox="0 0 206 438" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "left-arm")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("left-arm")}
      >
        <path className={pathClass("left-arm")} d="M30 0L0 42L40 167L119 200V181L63 48L30 0Z" fill={getRiskColor("left-arm")}/>
        <path className={pathClass("left-arm")} d="M78 35L126 173L113 63L78 35Z" fill={getRiskColor("left-arm")}/>
        <path className={pathClass("left-arm")} d="M41 178L50 206L116 245V215L41 178Z" fill={getRiskColor("left-arm")}/>
        <path className={pathClass("left-arm")} d="M122 206V261L190 422L206 414L176 298L122 206Z" fill={getRiskColor("left-arm")}/>
        <path className={pathClass("left-arm")} d="M54 225L68 286L154 438L180 426L104 250L54 225Z" fill={getRiskColor("left-arm")}/>
      </svg>
      
      {/* Left Hand */}
      <svg 
        id="left-hand" 
        className={partClass("left-hand")}
        style={{ marginLeft: "172px", top: "336px" }}
        width="60" 
        height="170" 
        viewBox="0 0 127 170" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "left-hand")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("left-hand")}
      >
        <path className={pathClass("left-hand")} d="M56.2675 0L41.2675 27L2.26746 36C2.26746 36 1.84616 62.7655 0.267456 83C-2.36253 116.709 15.2675 170 15.2675 170H26.2675L19.2675 131L30.2675 126L43.2675 167L56.2675 165L45.2675 119L54.2675 113L71.2675 158L85.2675 157L68.2675 106L77.2675 101L99.2675 151L109.267 149L85.2675 66L89.2675 53L120.267 73L126.267 66L99.2675 27L56.2675 0Z" fill={getRiskColor("left-hand")}/>
      </svg>

      {/* Abdomen */}
      <svg 
        id="abdomen" 
        className={partClass("abdomen")}
        style={{ marginLeft: "-70px", top: "210px" }}
        width="180" 
        height="230" 
        viewBox="0 0 293 420" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "abdomen")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("abdomen")}
      >
        <path className={pathClass("abdomen")} d="M129 11L128 54L77 85V41L129 11Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M128 73V127L76 136V105L128 73Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M127 139L126 217L81 194V153L127 139Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M126 237V317L141 417L83 339V221L126 237Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M167 232V312L152 412L210 334V216L167 232Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M159 11L221 31V75L161 50L159 11Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M164 67L216 96L220 137L164 123V67Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M212 153L217 197L165 210V142L212 153Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M57 27L21 63L1 7L57 27Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M55 38L58 84L24 70L55 38Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M61 96L67.5 154L30 126L23 78L61 96Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M67 161V215L30 191L32 134L67 161Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M59 227L69 281V386L43 388L0 320L18 252L21 208L59 227Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M235 20L271 56L291 0L235 20Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M236 31L233 77L267 63L236 31Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M233.5 89L227 147L264.5 119L271.5 71L233.5 89Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M228 153V207L265 183L263 126L228 153Z" fill={getRiskColor("abdomen")}/>
        <path className={pathClass("abdomen")} d="M234 217L224 271V376L250 378L293 310L275 242L272 198L234 217Z" fill={getRiskColor("abdomen")}/>
      </svg>

      {/* Right Leg */}
      <svg 
        id="right-leg" 
        className={partClass("right-leg")}
        style={{ marginLeft: "-110px", top: "420px", zIndex: 9999 }}
        width="162" 
        height="350" 
        viewBox="0 0 162 756" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "right-leg")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("right-leg")}
      >
        <path className={pathClass("right-leg")} d="M23.0673 0L33 97.5L0 299.5V162L23.0673 0Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M38 3.5L151 176V252L117 164L41 85.5L38 3.5Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M40 100.5L95 190L121 290.5L107 384L52 290.5L30 176.5L40 100.5Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M117.5 212.5L150 276.5L131 396.5L114.5 384.5L131 271.5L117.5 212.5Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M29.0001 191.5V291.5L91.0001 366L69.0001 396L16.5315 291.5L29.0001 191.5Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M61 17.5L139 68L115 98L61 17.5Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M144 71L162 96.0333L159 163L119 104.033L144 71Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M16.0001 346L40.8465 446L27.0001 436L16 496L16.0001 346Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M50 408H84L95 424L74 490H56V448L43 432L50 408Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M115 413V471L85 567L75 509L115 413Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M29.7076 449L62.7076 521L57.7076 667L75.7076 751H57.7076L13 587L29.7076 449Z" fill={getRiskColor("right-leg")}/>
        <path className={pathClass("right-leg")} d="M110 506L129 562L121 626L102.5 662L89 756L87 662V592L110 506Z" fill={getRiskColor("right-leg")}/>
      </svg>

      {/* Right Foot */}
      <svg 
        id="right-foot" 
        className={partClass("right-foot")}
        style={{ marginLeft: "-70px", top: "773px" }}
        width="60" 
        height="50" 
        viewBox="0 0 86 90" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "right-foot")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("right-foot")}
      >
        <path className={pathClass("right-foot")} d="M68 0L86 30L80 90H68L64 78L59 90L5 88L0 69L22 22L68 0Z" fill={getRiskColor("right-foot")}/>
      </svg>

      {/* Left Leg */}
      <svg 
        id="left-leg" 
        className={partClass("left-leg")}
        style={{ marginLeft: "-10px", top: "415px", zIndex: 9999 }}
        width="156" 
        height="350" 
        viewBox="0 0 156 769" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "left-leg")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("left-leg")}
      >
        <path className={pathClass("left-leg")} d="M132.933 0L123 97.5L146 302L156 172L132.933 0Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M114 24L11 208L4 304.5L38 216.5L114 112V24Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M114 127L55 210.5L29 311L43 404.5L98 311L120 197L114 127Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M32.5 256L-1.52588e-05 320L19 440L35.5 428L19 315L32.5 256Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M124 218L115 318L70.9999 384L86.9999 410L136.469 318L124 218Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M92 27L26 86.5L52 109.5L92 27Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M22 91L10 111.033L13 178L53 119.033L22 91Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M129.846 360L105 460L118.846 450L129.847 510L129.846 360Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M89 424H55L44 440L65 506H83V464L96 448L89 424Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M23 437V495L57 591L63 533L23 437Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M113 468L80 540L85 686L67 764L85 768L129.708 606L113 468Z" fill={getRiskColor("left-leg")}/>
        <path className={pathClass("left-leg")} d="M24 519L11 575L19 639L37.5 675L51 769L53 675V605L24 519Z" fill={getRiskColor("left-leg")}/>
      </svg>

      {/* Left Foot */}
      <svg 
        id="left-foot" 
        className={partClass("left-foot")}
        style={{ marginLeft: "40px", top: "771px" }}
        width="60" 
        height="50" 
        viewBox="0 0 86 90" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={(e) => handleMouseMove(e, "left-foot")}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePartClick("left-foot")}
      >
        <path className={pathClass("left-foot")} d="M18 0L0 30L6 90H18L22 78L27 90L81 88L86 69L64 22L18 0Z" fill={getRiskColor("left-foot")}/>
      </svg>
    </div>
    </>
  );
}


