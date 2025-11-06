import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: OAuth callback handler
 * GET /api/auth/callback
 * 
 * This route handles the redirect from Google OAuth
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      new URL(`/?error=${error}`, process.env.NEXT_PUBLIC_APP_URL)
    );
  }

  // Handle missing code
  if (!code) {
    return NextResponse.redirect(
      new URL("/?error=missing_code", process.env.NEXT_PUBLIC_APP_URL)
    );
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await userInfoResponse.json();

    // Store user in Supabase database
    console.log('[OAuth Callback] 📝 Attempting to save user to Supabase...');
    console.log('[OAuth Callback] User Info:', { id: userInfo.id, email: userInfo.email, name: userInfo.name });
    
    try {
      const supabaseResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users/upsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            googleId: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            pictureUrl: userInfo.picture,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          }),
        }
      );

      if (!supabaseResponse.ok) {
        const errorData = await supabaseResponse.json();
        console.error('[OAuth Callback] ❌ Failed to save user to database:', errorData);
        console.error('[OAuth Callback] 💡 Response status:', supabaseResponse.status);
      } else {
        const result = await supabaseResponse.json();
        console.log('[OAuth Callback] ✅ User saved to database successfully:', result);
      }
    } catch (error) {
      console.error('[OAuth Callback] ❌ Database error:', error);
      console.error('[OAuth Callback] 💡 Check if NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
      // Continue anyway - user can still use the app with localStorage
    }

    // Store in localStorage via client-side redirect
    const redirectUrl = new URL("/auth/complete", process.env.NEXT_PUBLIC_APP_URL);
    redirectUrl.searchParams.set("access_token", tokens.access_token);
    redirectUrl.searchParams.set("refresh_token", tokens.refresh_token);
    redirectUrl.searchParams.set("user_id", userInfo.id);
    redirectUrl.searchParams.set("user_email", userInfo.email);
    redirectUrl.searchParams.set("user_name", userInfo.name);
    redirectUrl.searchParams.set("user_picture", userInfo.picture || "");

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=auth_failed", process.env.NEXT_PUBLIC_APP_URL)
    );
  }
}

