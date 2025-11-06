import { NextRequest, NextResponse } from "next/server";
import { upsertUser } from "@/lib/supabase/database";

/**
 * API Route: Upsert user to database
 * POST /api/users/upsert
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { googleId, email, name, pictureUrl, accessToken, refreshToken } = body;

    console.log('[API /users/upsert] 📝 Received request:', { googleId, email, name });

    if (!googleId || !email) {
      console.error('[API /users/upsert] ❌ Missing required fields');
      return NextResponse.json(
        { error: "Google ID and email are required" },
        { status: 400 }
      );
    }

    console.log('[API /users/upsert] 💾 Calling upsertUser...');
    const user = await upsertUser({
      googleId,
      email,
      name: name || "",
      pictureUrl,
      accessToken,
      refreshToken,
    });

    console.log('[API /users/upsert] ✅ User upserted successfully:', user?.id);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('[API /users/upsert] ❌ Error upserting user:', error);
    console.error('[API /users/upsert] 💡 Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: "Failed to save user",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

