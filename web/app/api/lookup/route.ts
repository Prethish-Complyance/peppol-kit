import { participantLookup } from "peppol-kit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const participant = request.nextUrl.searchParams.get("participant");
  const sml = request.nextUrl.searchParams.get("sml");

  if (!participant) {
    return NextResponse.json(
      { error: "Participant ID is required" },
      { status: 400 }
    );
  }

  if (sml !== "test" && sml !== "production") {
    return NextResponse.json(
      { error: "SML must be either test or production" },
      { status: 400 }
    );
  }

  try {
    const result = await participantLookup(participant, sml);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Lookup failed",
      },
      { status: 500 }
    );
  }
}