/**
 * Google Fit API Client
 * Fetches health and fitness data from Google Fit
 */

import { GoogleFitData } from "@/types";

const GOOGLE_FIT_API_BASE = "https://www.googleapis.com/fitness/v1/users/me";

/**
 * Fetch fitness data for a date range
 */
export async function fetchGoogleFitData(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<GoogleFitData> {
  const startTimeMillis = startDate.getTime();
  const endTimeMillis = endDate.getTime();

  // Fetch all data in parallel
  const [stepsData, heartRateData, sleepData, caloriesData, distanceData, activitiesData] = 
    await Promise.all([
      fetchSteps(accessToken, startTimeMillis, endTimeMillis),
      fetchHeartRate(accessToken, startTimeMillis, endTimeMillis),
      fetchSleep(accessToken, startTimeMillis, endTimeMillis),
      fetchCalories(accessToken, startTimeMillis, endTimeMillis),
      fetchDistance(accessToken, startTimeMillis, endTimeMillis),
      fetchActivities(accessToken, startTimeMillis, endTimeMillis),
    ]);

  return {
    steps: stepsData,
    distance: distanceData,
    calories: caloriesData,
    activeMinutes: calculateActiveMinutes(activitiesData),
    heartRate: heartRateData,
    sleep: sleepData,
    activities: activitiesData,
  };
}

/**
 * Fetch step count data
 */
async function fetchSteps(
  accessToken: string,
  startTimeMillis: number,
  endTimeMillis: number
): Promise<number> {
  const response = await fetch(
    `${GOOGLE_FIT_API_BASE}/dataset:aggregate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: "com.google.step_count.delta",
        }],
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
        startTimeMillis,
        endTimeMillis,
      }),
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch steps:", await response.text());
    return 0;
  }

  const data = await response.json();
  const steps = data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
  return steps;
}

/**
 * Fetch heart rate data
 */
async function fetchHeartRate(
  accessToken: string,
  startTimeMillis: number,
  endTimeMillis: number
): Promise<{ average: number; resting: number; max: number }> {
  const response = await fetch(
    `${GOOGLE_FIT_API_BASE}/dataset:aggregate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: "com.google.heart_rate.bpm",
        }],
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
        startTimeMillis,
        endTimeMillis,
      }),
    }
  );

  if (!response.ok) {
    return { average: 0, resting: 0, max: 0 };
  }

  const data = await response.json();
  const points = data.bucket?.[0]?.dataset?.[0]?.point || [];
  
  if (points.length === 0) {
    return { average: 0, resting: 0, max: 0 };
  }

  const heartRates = points.map((p: any) => p.value[0].fpVal);
  const average = Math.round(heartRates.reduce((a: number, b: number) => a + b, 0) / heartRates.length);
  const max = Math.round(Math.max(...heartRates));
  const resting = Math.round(Math.min(...heartRates));

  return { average, resting, max };
}

/**
 * Fetch sleep data
 */
async function fetchSleep(
  accessToken: string,
  startTimeMillis: number,
  endTimeMillis: number
): Promise<{ duration: number; deepSleep: number; lightSleep: number; remSleep: number }> {
  const response = await fetch(
    `${GOOGLE_FIT_API_BASE}/dataset:aggregate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: "com.google.sleep.segment",
        }],
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
        startTimeMillis,
        endTimeMillis,
      }),
    }
  );

  if (!response.ok) {
    return { duration: 0, deepSleep: 0, lightSleep: 0, remSleep: 0 };
  }

  const data = await response.json();
  const points = data.bucket?.[0]?.dataset?.[0]?.point || [];

  let totalDuration = 0;
  let deepSleep = 0;
  let lightSleep = 0;
  let remSleep = 0;

  points.forEach((point: any) => {
    const duration = (point.endTimeNanos - point.startTimeNanos) / 60000000000; // Convert to minutes
    totalDuration += duration;

    const sleepType = point.value[0].intVal;
    if (sleepType === 4) deepSleep += duration; // Deep sleep
    else if (sleepType === 5) lightSleep += duration; // Light sleep
    else if (sleepType === 6) remSleep += duration; // REM sleep
  });

  return {
    duration: Math.round(totalDuration),
    deepSleep: Math.round(deepSleep),
    lightSleep: Math.round(lightSleep),
    remSleep: Math.round(remSleep),
  };
}

/**
 * Fetch calories burned
 */
async function fetchCalories(
  accessToken: string,
  startTimeMillis: number,
  endTimeMillis: number
): Promise<number> {
  const response = await fetch(
    `${GOOGLE_FIT_API_BASE}/dataset:aggregate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: "com.google.calories.expended",
        }],
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
        startTimeMillis,
        endTimeMillis,
      }),
    }
  );

  if (!response.ok) {
    return 0;
  }

  const data = await response.json();
  const calories = data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
  return Math.round(calories);
}

/**
 * Fetch distance traveled
 */
async function fetchDistance(
  accessToken: string,
  startTimeMillis: number,
  endTimeMillis: number
): Promise<number> {
  const response = await fetch(
    `${GOOGLE_FIT_API_BASE}/dataset:aggregate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: "com.google.distance.delta",
        }],
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
        startTimeMillis,
        endTimeMillis,
      }),
    }
  );

  if (!response.ok) {
    return 0;
  }

  const data = await response.json();
  const distance = data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
  return Math.round(distance);
}

/**
 * Fetch activity sessions
 */
async function fetchActivities(
  accessToken: string,
  startTimeMillis: number,
  endTimeMillis: number
): Promise<Array<{ type: string; duration: number; calories: number; startTime: string; endTime: string }>> {
  const response = await fetch(
    `${GOOGLE_FIT_API_BASE}/sessions?startTime=${new Date(startTimeMillis).toISOString()}&endTime=${new Date(endTimeMillis).toISOString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const sessions = data.session || [];

  return sessions.map((session: any) => ({
    type: getActivityName(session.activityType),
    duration: Math.round((session.endTimeMillis - session.startTimeMillis) / 60000), // Convert to minutes
    calories: 0, // Need separate call to get calories per session
    startTime: new Date(parseInt(session.startTimeMillis)).toISOString(),
    endTime: new Date(parseInt(session.endTimeMillis)).toISOString(),
  }));
}

/**
 * Calculate total active minutes from activities
 */
function calculateActiveMinutes(activities: any[]): number {
  return activities.reduce((total, activity) => total + activity.duration, 0);
}

/**
 * Map Google Fit activity type codes to readable names
 */
function getActivityName(activityType: number): string {
  const activityMap: { [key: number]: string } = {
    1: "Cycling",
    8: "Running",
    7: "Walking",
    9: "Aerobics",
    10: "Badminton",
    11: "Baseball",
    12: "Basketball",
    13: "Biathlon",
    82: "Swimming",
    93: "Yoga",
    96: "Weightlifting",
    108: "Hiking",
  };

  return activityMap[activityType] || "Other Activity";
}

/**
 * Fetch data for the last N days
 */
export async function fetchLastNDays(accessToken: string, days: number): Promise<GoogleFitData[]> {
  const endDate = new Date();
  const results: GoogleFitData[] = [];

  for (let i = 0; i < days; i++) {
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - i);
    startDate.setHours(0, 0, 0, 0);

    const dayEnd = new Date(startDate);
    dayEnd.setHours(23, 59, 59, 999);

    const data = await fetchGoogleFitData(accessToken, startDate, dayEnd);
    results.unshift(data);
  }

  return results;
}

