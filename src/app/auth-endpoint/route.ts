import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../firebase-admin";

export async function POST(req: NextRequest) {
  try {
    //  Protect the route to ensure only authenticated users access
    await auth.protect();

    //  Get session info from Clerk (custom JWT fields like email/fullName/image)
    const { sessionClaims } = await auth();

    const { room } = await req.json();

    //  Validate presence of email and room
    if (!sessionClaims?.email || !room) {
      return NextResponse.json(
        { message: "Missing required data" },
        { status: 400 }
      );
    }

    //  Prepare a Liveblocks session with the user's identity
    const session = liveblocks.prepareSession(sessionClaims.email, {
      userInfo: {
        name: sessionClaims.fullName,
        email: sessionClaims.email,
        avatar: sessionClaims.image,
      },
    });

    //  Check Firestore: is this user part of the requested room?
    const usersInRoom = await adminDb
      .collectionGroup("rooms")
      .where("userId", "==", sessionClaims.email)
      .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    //  Allow access if the user is found in that room
    if (userInRoom?.exists) {
      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();
      return new Response(body, { status });
    }

    // Otherwise, deny access
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
