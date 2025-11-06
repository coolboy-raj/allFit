import { DashboardData, User, HealthScore, InjuryRisk, HealthMetrics, AIRecommendation } from "@/types";

// Mock user data
export const mockUser: User = {
  id: "1",
  email: "john.doe@example.com",
  name: "John Doe",
  googleId: "google_123456",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date(),
};

// Mock health score
export const mockHealthScore: HealthScore = {
  id: "hs_1",
  userId: "1",
  date: new Date(),
  overallScore: 82,
  activityLevel: 85,
  sleepQuality: 75,
  recoveryScore: 88,
  consistency: 80,
};

// Mock injury risk
export const mockInjuryRisk: InjuryRisk = {
  level: "LOW",
  score: 25,
  factors: [
    "Good recovery patterns detected",
    "Consistent training schedule",
    "Adequate rest days",
  ],
  recommendations: [
    "Maintain current training intensity",
    "Continue prioritizing sleep",
    "Stay hydrated during workouts",
  ],
};

// Mock weekly metrics (last 7 days)
export const mockWeeklyMetrics: HealthMetrics[] = [
  {
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    steps: 8234,
    activeMinutes: 45,
    heartRate: 72,
    sleepHours: 7.5,
    caloriesBurned: 2340,
    workoutSessions: [{
      type: "Running",
      duration: 30,
      intensity: "medium",
      caloriesBurned: 350,
      startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    }],
  },
  {
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    steps: 10567,
    activeMinutes: 62,
    heartRate: 75,
    sleepHours: 8.0,
    caloriesBurned: 2680,
    workoutSessions: [{
      type: "Cycling",
      duration: 45,
      intensity: "high",
      caloriesBurned: 520,
      startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    }],
  },
  {
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    steps: 6543,
    activeMinutes: 30,
    heartRate: 68,
    sleepHours: 7.0,
    caloriesBurned: 2100,
    workoutSessions: [{
      type: "Yoga",
      duration: 30,
      intensity: "low",
      caloriesBurned: 150,
      startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    }],
  },
  {
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    steps: 12345,
    activeMinutes: 75,
    heartRate: 78,
    sleepHours: 6.5,
    caloriesBurned: 2890,
    workoutSessions: [
      {
        type: "Running",
        duration: 40,
        intensity: "high",
        caloriesBurned: 480,
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        type: "Strength Training",
        duration: 35,
        intensity: "medium",
        caloriesBurned: 280,
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    steps: 9876,
    activeMinutes: 55,
    heartRate: 73,
    sleepHours: 7.5,
    caloriesBurned: 2540,
    workoutSessions: [{
      type: "Swimming",
      duration: 45,
      intensity: "medium",
      caloriesBurned: 400,
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }],
  },
  {
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    steps: 7654,
    activeMinutes: 40,
    heartRate: 70,
    sleepHours: 8.0,
    caloriesBurned: 2280,
    workoutSessions: [{
      type: "Walking",
      duration: 40,
      intensity: "low",
      caloriesBurned: 200,
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }],
  },
  {
    date: new Date(),
    steps: 11234,
    activeMinutes: 68,
    heartRate: 76,
    sleepHours: 7.0,
    caloriesBurned: 2720,
    workoutSessions: [{
      type: "Running",
      duration: 50,
      intensity: "medium",
      caloriesBurned: 580,
      startTime: new Date(),
      endTime: new Date(),
    }],
  },
];

// Mock AI recommendations
export const mockRecommendations: AIRecommendation[] = [
  {
    id: "rec_1",
    userId: "1",
    date: new Date(),
    type: "activity",
    title: "Great consistency!",
    description: "You've maintained steady activity levels this week. Keep up the excellent work!",
    priority: "low",
    completed: false,
  },
  {
    id: "rec_2",
    userId: "1",
    date: new Date(),
    type: "sleep",
    title: "Prioritize sleep tonight",
    description: "Your sleep dropped below 7 hours on Wednesday. Aim for 7-8 hours tonight to optimize recovery.",
    priority: "medium",
    completed: false,
  },
  {
    id: "rec_3",
    userId: "1",
    date: new Date(),
    type: "rest",
    title: "Consider a rest day tomorrow",
    description: "You've been active 6 consecutive days. A rest day or light activity would benefit recovery.",
    priority: "medium",
    completed: false,
  },
  {
    id: "rec_4",
    userId: "1",
    date: new Date(),
    type: "hydration",
    title: "Stay hydrated",
    description: "Based on your activity level, aim for 2.5-3L of water today.",
    priority: "low",
    completed: false,
  },
];

// Complete dashboard data
export const mockDashboardData: DashboardData = {
  user: mockUser,
  healthScore: mockHealthScore,
  injuryRisk: mockInjuryRisk,
  weeklyMetrics: mockWeeklyMetrics,
  recommendations: mockRecommendations,
};

// Helper function to generate random variation (for demo purposes)
export function generateMockData(): DashboardData {
  return mockDashboardData;
}

