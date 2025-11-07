/**
 * Performance Analysis Chart Configurations
 * Styled after Black Dashboard React template with Chart.js v3+ API
 * 
 * Features:
 * - Beautiful gradient fills
 * - Smooth animations
 * - Modern dark theme
 * - Multiple color schemes
 */

import { ChartOptions } from 'chart.js';

// Color palette from Black Dashboard
export const CHART_COLORS = {
  blue: '#1f8ef1',
  purple: '#d048b6',
  purpleAlt: '#e14eca',
  green: '#00d6b4',
  teal: '#00f2c3',
  pink: '#fd5d93',
  orange: '#f96332',
  yellow: '#ffc107',
  red: '#ef5350',
};

// Common chart options adapted from Black Dashboard
const commonOptions: ChartOptions<'line' | 'bar'> = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#f5f5f5',
      titleColor: '#333',
      bodyColor: '#666',
      padding: 12,
      caretSize: 0,
      displayColors: true,
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      callbacks: {
        labelTextColor: () => '#666',
      },
    },
  },
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    y: {
      grid: {
        drawBorder: false,
        color: 'rgba(29,140,248,0.05)',
        lineWidth: 1,
      },
      border: {
        display: false,
      },
      ticks: {
        padding: 20,
        color: '#9a9a9a',
        font: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
      },
    },
    x: {
      grid: {
        drawBorder: false,
        color: 'rgba(29,140,248,0.1)',
        lineWidth: 1,
      },
      border: {
        display: false,
      },
      ticks: {
        padding: 20,
        color: '#9a9a9a',
        font: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
      },
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart',
  },
};

/**
 * Creates gradient for chart background based on color
 */
function createGradient(ctx: CanvasRenderingContext2D, color: string): CanvasGradient {
  const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
  
  switch (color) {
    // Blue gradient
    case CHART_COLORS.blue:
    case '#1f8ef1':
      gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
      gradientStroke.addColorStop(0, 'rgba(29,140,248,0)');
      break;
    
    // Green/Teal gradient
    case CHART_COLORS.green:
    case CHART_COLORS.teal:
    case '#00d6b4':
    case '#00f2c3':
      gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
      gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)');
      gradientStroke.addColorStop(0, 'rgba(66,134,121,0)');
      break;
    
    // Purple gradient
    case CHART_COLORS.purple:
    case CHART_COLORS.purpleAlt:
    case '#d048b6':
    case '#e14eca':
      gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
      gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
      gradientStroke.addColorStop(0, 'rgba(119,52,169,0)');
      break;
    
    // Pink/Red gradient
    case CHART_COLORS.pink:
    case CHART_COLORS.red:
    case '#fd5d93':
    case '#ef5350':
      gradientStroke.addColorStop(1, 'rgba(253,93,147,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(253,93,147,0.0)');
      gradientStroke.addColorStop(0, 'rgba(253,93,147,0)');
      break;
    
    // Orange gradient
    case CHART_COLORS.orange:
    case '#f96332':
      gradientStroke.addColorStop(1, 'rgba(249,99,50,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(249,99,50,0.0)');
      gradientStroke.addColorStop(0, 'rgba(249,99,50,0)');
      break;
    
    // Yellow gradient
    case CHART_COLORS.yellow:
    case '#ffc107':
      gradientStroke.addColorStop(1, 'rgba(255,193,7,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(255,193,7,0.0)');
      gradientStroke.addColorStop(0, 'rgba(255,193,7,0)');
      break;
    
    // Default blue gradient
    default:
      gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
      gradientStroke.addColorStop(0, 'rgba(29,140,248,0)');
  }
  
  return gradientStroke;
}

/**
 * Creates a line chart with gradient fill (Black Dashboard style)
 */
export const createLineChartData = (
  canvas: HTMLCanvasElement, 
  labels: string[], 
  data: number[], 
  color: string = CHART_COLORS.blue
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradientStroke = createGradient(ctx, color);

  return {
    labels,
    datasets: [
      {
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: color,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: color,
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: color,
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data,
        tension: 0.4,
      },
    ],
  };
};

/**
 * Creates a bar chart with gradient fill (Black Dashboard style)
 */
export const createBarChartData = (
  canvas: HTMLCanvasElement, 
  labels: string[], 
  data: number[], 
  color: string = CHART_COLORS.purple
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradientStroke = createGradient(ctx, color);

  return {
    labels,
    datasets: [
      {
        label: 'Data',
        backgroundColor: gradientStroke,
        hoverBackgroundColor: gradientStroke,
        borderColor: color,
        borderWidth: 2,
        borderRadius: 4,
        data,
      },
    ],
  };
};

/**
 * Creates a multi-line chart (Black Dashboard style)
 * Perfect for comparing multiple metrics
 */
export const createMultiLineChartData = (
  canvas: HTMLCanvasElement,
  labels: string[],
  datasets: Array<{ label: string; data: number[]; color: string; fill?: boolean }>
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  return {
    labels,
    datasets: datasets.map(dataset => {
      const config: any = {
        label: dataset.label,
        fill: dataset.fill || false,
        borderColor: dataset.color,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: dataset.color,
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: dataset.color,
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: dataset.data,
        tension: 0.4,
      };

      // Add gradient if fill is enabled
      if (dataset.fill) {
        config.backgroundColor = createGradient(ctx, dataset.color);
      }

      return config;
    }),
  };
};

/**
 * Creates a multi-bar chart (Black Dashboard style)
 * Perfect for comparing categories
 */
export const createMultiBarChartData = (
  canvas: HTMLCanvasElement,
  labels: string[],
  datasets: Array<{ label: string; data: number[]; color: string }>
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  return {
    labels,
    datasets: datasets.map(dataset => ({
      label: dataset.label,
      backgroundColor: dataset.color,
      hoverBackgroundColor: dataset.color,
      borderColor: dataset.color,
      borderWidth: 0,
      borderRadius: 4,
      data: dataset.data,
      barPercentage: 0.7,
      categoryPercentage: 0.9,
    })),
  };
};

// Export options for different chart types

/**
 * Line chart options (Black Dashboard style)
 */
export const lineChartOptions: ChartOptions<'line'> = {
  ...commonOptions,
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

/**
 * Bar chart options with purple-tinted grid (Black Dashboard style)
 */
export const barChartOptions: ChartOptions<'bar'> = {
  ...commonOptions,
  scales: {
    y: {
      grid: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
        lineWidth: 1,
      },
      border: {
        display: false,
      },
      ticks: {
        padding: 20,
        color: '#9e9e9e',
        font: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
      },
    },
    x: {
      grid: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
        lineWidth: 1,
      },
      border: {
        display: false,
      },
      ticks: {
        padding: 20,
        color: '#9e9e9e',
        font: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
      },
    },
  },
};

/**
 * Multi-line chart options with legend (Black Dashboard style)
 */
export const multiLineChartOptions: ChartOptions<'line'> = {
  ...commonOptions,
  plugins: {
    ...commonOptions.plugins,
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: '#9a9a9a',
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

/**
 * Multi-bar chart options with legend (Black Dashboard style)
 */
export const multiBarChartOptions: ChartOptions<'bar'> = {
  ...barChartOptions,
  plugins: {
    ...barChartOptions.plugins,
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: '#9a9a9a',
        padding: 15,
        usePointStyle: true,
        pointStyle: 'rect',
        font: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
      },
    },
  },
};

/**
 * Area chart options (line chart with fill)
 */
export const areaChartOptions: ChartOptions<'line'> = {
  ...lineChartOptions,
};

/**
 * Creates a simple area chart with single dataset
 */
export const createAreaChartData = (
  canvas: HTMLCanvasElement,
  labels: string[],
  data: number[],
  color: string = CHART_COLORS.blue,
  label: string = 'Data'
) => {
  return createLineChartData(canvas, labels, data, color);
};

