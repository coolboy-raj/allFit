/**
 * Chart Examples and Templates
 * Showcasing all available chart types with Black Dashboard styling
 * 
 * Use these examples as templates for creating charts throughout your app
 */

import { CHART_COLORS } from './performance-charts';

// Sample data generators for demos
export const generateMonthlyLabels = () => [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

export const generateWeeklyLabels = () => [
  'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'
];

export const generateRandomData = (count: number, min: number = 60, max: number = 120) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1) + min)
  );
};

// ========================================
// CHART EXAMPLE CONFIGURATIONS
// ========================================

/**
 * Example 1: Performance Trend Line Chart (Blue)
 * Use case: Tracking performance metrics over time
 */
export const performanceTrendExample = {
  type: 'line' as const,
  color: CHART_COLORS.blue,
  title: 'Performance Trend',
  description: 'Athlete performance over the last 12 months',
  sampleData: {
    labels: generateMonthlyLabels(),
    data: [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
  },
};

/**
 * Example 2: Training Volume Bar Chart (Purple)
 * Use case: Comparing training volumes across periods
 */
export const trainingVolumeExample = {
  type: 'bar' as const,
  color: CHART_COLORS.purple,
  title: 'Training Volume',
  description: 'Weekly training hours by athlete',
  sampleData: {
    labels: ['Athlete A', 'Athlete B', 'Athlete C', 'Athlete D', 'Athlete E', 'Athlete F'],
    data: [53, 20, 10, 80, 100, 45],
  },
};

/**
 * Example 3: Recovery Status Line Chart (Green)
 * Use case: Monitoring recovery and readiness
 */
export const recoveryStatusExample = {
  type: 'line' as const,
  color: CHART_COLORS.green,
  title: 'Recovery Status',
  description: 'Recovery score over time',
  sampleData: {
    labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
    data: [90, 27, 60, 12, 80],
  },
};

/**
 * Example 4: Multi-Metric Comparison (Multiple Lines)
 * Use case: Comparing multiple metrics simultaneously
 */
export const multiMetricExample = {
  type: 'multiLine' as const,
  title: 'Performance Metrics Comparison',
  description: 'Track multiple metrics at once',
  datasets: [
    {
      label: 'Strength',
      data: [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
      color: CHART_COLORS.blue,
      fill: true,
    },
    {
      label: 'Endurance',
      data: [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
      color: CHART_COLORS.green,
      fill: false,
    },
    {
      label: 'Flexibility',
      data: [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
      color: CHART_COLORS.pink,
      fill: false,
    },
  ],
  sampleLabels: generateMonthlyLabels(),
};

/**
 * Example 5: Activity Type Breakdown (Stacked Bars)
 * Use case: Showing activity distribution
 */
export const activityBreakdownExample = {
  type: 'multiBar' as const,
  title: 'Activity Type Distribution',
  description: 'Weekly breakdown of workout types',
  datasets: [
    {
      label: 'Cardio',
      data: [12, 19, 15, 17, 14, 18, 16],
      color: CHART_COLORS.blue,
    },
    {
      label: 'Strength',
      data: [8, 12, 10, 14, 11, 13, 12],
      color: CHART_COLORS.purple,
    },
    {
      label: 'Flexibility',
      data: [5, 7, 6, 8, 7, 6, 8],
      color: CHART_COLORS.green,
    },
  ],
  sampleLabels: generateWeeklyLabels(),
};

/**
 * Example 6: Injury Risk Zones (Pink/Red)
 * Use case: Highlighting high-risk areas
 */
export const injuryRiskExample = {
  type: 'line' as const,
  color: CHART_COLORS.pink,
  title: 'Injury Risk Score',
  description: 'Real-time injury risk monitoring',
  sampleData: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    data: [20, 35, 45, 60, 75, 55],
  },
  thresholds: {
    low: 30,
    medium: 60,
    high: 80,
  },
};

/**
 * Example 7: Weekly Load Monitoring (Orange)
 * Use case: Training load tracking
 */
export const trainingLoadExample = {
  type: 'bar' as const,
  color: CHART_COLORS.orange,
  title: 'Weekly Training Load',
  description: 'Total training load by week',
  sampleData: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    data: [450, 520, 480, 550, 600, 530],
  },
};

/**
 * Example 8: Performance Zones (Multiple Colors)
 * Use case: Zone-based training analysis
 */
export const performanceZonesExample = {
  type: 'multiLine' as const,
  title: 'Heart Rate Zones',
  description: 'Time spent in each HR zone',
  datasets: [
    {
      label: 'Zone 1 (Recovery)',
      data: [45, 50, 48, 52, 47, 49, 51],
      color: CHART_COLORS.blue,
      fill: false,
    },
    {
      label: 'Zone 2 (Aerobic)',
      data: [35, 38, 36, 40, 37, 39, 38],
      color: CHART_COLORS.green,
      fill: false,
    },
    {
      label: 'Zone 3 (Tempo)',
      data: [25, 28, 26, 30, 27, 29, 28],
      color: CHART_COLORS.yellow,
      fill: false,
    },
    {
      label: 'Zone 4 (Threshold)',
      data: [15, 18, 16, 20, 17, 19, 18],
      color: CHART_COLORS.orange,
      fill: false,
    },
    {
      label: 'Zone 5 (Max)',
      data: [5, 8, 6, 10, 7, 9, 8],
      color: CHART_COLORS.red,
      fill: false,
    },
  ],
  sampleLabels: generateWeeklyLabels(),
};

/**
 * Example 9: Progress Over Time (Green Growth)
 * Use case: Showing improvement and progress
 */
export const progressExample = {
  type: 'line' as const,
  color: CHART_COLORS.teal,
  title: 'Strength Progress',
  description: 'Max weight progression over 6 months',
  sampleData: {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    data: [100, 105, 110, 118, 125, 135],
  },
};

/**
 * Example 10: Team Comparison (Multi-Bar)
 * Use case: Comparing metrics across team members
 */
export const teamComparisonExample = {
  type: 'multiBar' as const,
  title: 'Team Performance Comparison',
  description: 'Key metrics across all athletes',
  datasets: [
    {
      label: 'Speed',
      data: [85, 92, 78, 88, 95, 82],
      color: CHART_COLORS.blue,
    },
    {
      label: 'Power',
      data: [78, 85, 72, 82, 88, 75],
      color: CHART_COLORS.purple,
    },
    {
      label: 'Endurance',
      data: [90, 88, 85, 92, 87, 89],
      color: CHART_COLORS.green,
    },
  ],
  sampleLabels: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'],
};

// ========================================
// USAGE EXAMPLES
// ========================================

/**
 * Example usage in a React component:
 * 
 * ```tsx
 * import { Line } from 'react-chartjs-2';
 * import { createLineChartData, lineChartOptions, CHART_COLORS } from '@/lib/performance-charts';
 * import { performanceTrendExample } from '@/lib/chart-examples';
 * 
 * function MyComponent() {
 *   const chartRef = useRef<ChartJS<'line'>>(null);
 *   
 *   return (
 *     <div className="h-[300px]">
 *       <Line
 *         ref={chartRef}
 *         data={(canvas) => createLineChartData(
 *           canvas,
 *           performanceTrendExample.sampleData.labels,
 *           performanceTrendExample.sampleData.data,
 *           performanceTrendExample.color
 *         )}
 *         options={lineChartOptions}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

// Export all examples
export const allExamples = {
  performanceTrend: performanceTrendExample,
  trainingVolume: trainingVolumeExample,
  recoveryStatus: recoveryStatusExample,
  multiMetric: multiMetricExample,
  activityBreakdown: activityBreakdownExample,
  injuryRisk: injuryRiskExample,
  trainingLoad: trainingLoadExample,
  performanceZones: performanceZonesExample,
  progress: progressExample,
  teamComparison: teamComparisonExample,
};

// Color scheme reference
export const colorSchemeGuide = {
  primary: {
    blue: { hex: CHART_COLORS.blue, use: 'Main performance metrics, primary data' },
    purple: { hex: CHART_COLORS.purple, use: 'Secondary metrics, alternative views' },
  },
  status: {
    green: { hex: CHART_COLORS.green, use: 'Positive trends, recovery, growth' },
    teal: { hex: CHART_COLORS.teal, use: 'Recovery metrics, wellness indicators' },
    yellow: { hex: CHART_COLORS.yellow, use: 'Warning levels, moderate zones' },
    orange: { hex: CHART_COLORS.orange, use: 'Training load, intensity metrics' },
    red: { hex: CHART_COLORS.red, use: 'High risk, critical zones' },
    pink: { hex: CHART_COLORS.pink, use: 'Injury risk, fatigue indicators' },
  },
  usage: {
    singleMetric: ['blue', 'green', 'purple'],
    comparison: ['blue', 'purple', 'green'],
    risk: ['pink', 'red', 'orange'],
    zones: ['blue', 'green', 'yellow', 'orange', 'red'],
  },
};

export default allExamples;

