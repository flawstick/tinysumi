// app/api/bible/daily-verse/route.ts - NextJS App Router API Route
import { NextResponse } from "next/server";

// Define the response type from the API
interface OurMannaResponse {
  verse: {
    details: {
      text: string;
      reference: string;
      version: string;
      verseurl: string;
    };
  };
}

export async function GET() {
  try {
    const response = await fetch(
      "https://beta.ourmanna.com/api/v1/get?format=json&order=daily",
      {
        headers: {
          accept: "application/json",
        },
        cache: "no-store", // Don't cache the result
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch daily verse");
    }

    const data = (await response.json()) as OurMannaResponse;

    return NextResponse.json({
      text: data.verse.details.text,
      reference: data.verse.details.reference,
      version: data.verse.details.version,
      verseUrl: data.verse.details.verseurl,
    });
  } catch (error) {
    console.error("Error fetching daily verse:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily verse" },
      { status: 500 },
    );
  }
}
