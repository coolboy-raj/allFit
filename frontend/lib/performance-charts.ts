/**
 * Performance Analysis Chart Configurations
 * Adapted from Black Dashboard React template
 */

import { ChartOptions } from 'chart.js';

// Common chart options adapted from black-dashboard
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
      bodySpacing: 4,
      padding: 12,
      mode: 'nearest',
      intersect: false,
      position: 'nearest',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
    },
  },
  responsive: true,
  scales: {
    y: {
      grid: {
        drawBorder: false,
        color: 'rgba(29,140,248,0.0)',
      },
      ticks: {
        padding: 20,
        color: '#9a9a9a',
      },
    },
    x: {
      grid: {
        drawBorder: false,
        color: 'rgba(29,140,248,0.1)',
      },
      ticks: {
        padding: 20,
        color: '#9a9a9a',
      },
    },
  },
};

export const createLineChartData = (canvas: HTMLCanvasElement, labels: string[], data: number[], color: string = '#1f8ef1') => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
  
  // Blue gradient
  if (color === '#1f8ef1') {
    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)');
  }
  // Green gradient
  else if (color === '#00d6b4') {
    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)');
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)');
  }
  // Purple gradient
  else if (color === '#d048b6') {
    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
    gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)');
  }
  // Red/Pink gradient
  else if (color === '#fd5d93') {
    gradientStroke.addColorStop(1, 'rgba(253,93,147,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(253,93,147,0.0)');
    gradientStroke.addColorStop(0, 'rgba(253,93,147,0)');
  }

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

export const createBarChartData = (canvas: HTMLCanvasElement, labels: string[], data: number[], color: string = '#d048b6') => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
  
  if (color === '#d048b6') {
    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
    gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)');
  }

  return {
    labels,
    datasets: [
      {
        backgroundColor: gradientStroke,
        hoverBackgroundColor: gradientStroke,
        borderColor: color,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data,
      },
    ],
  };
};

export const createMultiLineChartData = (
  canvas: HTMLCanvasElement,
  labels: string[],
  datasets: Array<{ label: string; data: number[]; color: string }>
) => {
  return {
    labels,
    datasets: datasets.map(dataset => ({
      label: dataset.label,
      fill: false,
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
    })),
  };
};

export const createMultiBarChartData = (
  canvas: HTMLCanvasElement,
  labels: string[],
  datasets: Array<{ label: string; data: number[]; color: string }>
) => {
  return {
    labels,
    datasets: datasets.map(dataset => ({
      label: dataset.label,
      backgroundColor: dataset.color,
      borderColor: dataset.color,
      borderWidth: 2,
      data: dataset.data,
      barPercentage: 0.8,
    })),
  };
};

// Export options for different chart types
export const lineChartOptions: ChartOptions<'line'> = {
  ...commonOptions,
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

export const barChartOptions: ChartOptions<'bar'> = {
  ...commonOptions,
  scales: {
    ...commonOptions.scales,
    y: {
      ...commonOptions.scales?.y,
      grid: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
      },
    },
    x: {
      ...commonOptions.scales?.x,
      grid: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
      },
    },
  },
};

export const multiLineChartOptions: ChartOptions<'line'> = {
  ...commonOptions,
  plugins: {
    ...commonOptions.plugins,
    legend: {
      display: true,
      labels: {
        color: '#9a9a9a',
        padding: 15,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

