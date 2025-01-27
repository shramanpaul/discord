import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  // Validate required query parameters
  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  }

  if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 }
    );
  }

  // Validate environment variables
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      {
        error: "Server misconfigured. Ensure LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and NEXT_PUBLIC_LIVEKIT_URL are set.",
      },
      { status: 500 }
    );
  }

  try {
    console.log("Creating AccessToken instance...");
    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    console.log("AccessToken instance created successfully.");
    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });
    // Await the token generation if it is a Promise
  const token = await at.toJwt();
  console.log("Generated Access Token route.ts.........:", token);

  // Return the token
  return NextResponse.json({ token });
  } catch (error) {
    console.error("Error during token generation process:", error);
    return NextResponse.json(
      { error: "Failed to generate token. Please check server logs." },
      { status: 500 }
    );
  }
  
}
