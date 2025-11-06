/**
 * Google OAuth Authentication (Sign-In Only)
 * Used only for user authentication, not for Health Connect data access
 */

export interface GoogleAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

/**
 * Initiates Google Sign-In OAuth flow
 * Note: Only requests basic profile info, NOT Health Connect/Fit data
 */
export function initiateGoogleAuth() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
  
  // Only request basic profile scopes - no health data
  const scope = encodeURIComponent(
    "openid email profile"
  );

  const authUrl = 
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=${scope}&` +
    `access_type=offline&` +
    `prompt=consent`;

  window.location.href = authUrl;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<GoogleAuthResponse> {
  const response = await fetch("/api/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
}

/**
 * Get user info from Google
 */
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<GoogleAuthResponse> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
}

/**
 * Revoke Google access token
 */
export async function revokeGoogleAccess(accessToken: string): Promise<void> {
  await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
    method: "POST",
  });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userId = localStorage.getItem('user_id');
  const accessToken = localStorage.getItem('access_token');
  
  return !!(userId && accessToken);
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): GoogleUserInfo | null {
  if (typeof window === 'undefined') return null;
  
  const userId = localStorage.getItem('user_id');
  const email = localStorage.getItem('user_email');
  const name = localStorage.getItem('user_name');
  const picture = localStorage.getItem('user_picture');
  
  if (!userId) return null;
  
  return {
    id: userId,
    email: email || '',
    name: name || '',
    picture: picture || '',
  };
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_picture');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_timestamp');
  localStorage.removeItem('user_settings');
  
  window.location.href = '/';
}
