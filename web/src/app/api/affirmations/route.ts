import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { dailyAffirmations } from "@/server/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { talkToTinyAI } from "@/ai/tinyai";

export async function GET() {
  try {
    // Get today's date range (from start of day to end of day)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Query for today's affirmation
    const todaysAffirmation = await db
      .select()
      .from(dailyAffirmations)
      .where(
        and(
          eq(dailyAffirmations.type, "tiny"),
          gte(dailyAffirmations.date, todayStart),
          lt(dailyAffirmations.date, todayEnd),
        ),
      )
      .limit(1);

    if (todaysAffirmation.length === 0) {
      const { message: affirmation, isError } = await talkToTinyAI(
        "Write an affirmation to a tiny girl. An example affirmation: You are daddy's good little girl. Always remember how special and loved you are.",
      );

      if (isError)
        return NextResponse.json(
          { error: "Failed to generate affirmation" },
          { status: 500 },
        );

      const newAffirmation = await db
        .insert(dailyAffirmations)
        .values({
          content: affirmation,
          date: todayStart,
          type: "tiny",
        })
        .returning();

      return NextResponse.json(
        {
          success: true,
          affirmation: newAffirmation[0],
        },
        { status: 201 },
      );
    }

    return NextResponse.json({
      success: true,
      affirmation: todaysAffirmation[0],
    });
  } catch (error) {
    console.error("Error fetching today's affirmation:", error);
    return NextResponse.json(
      { error: "Failed to fetch today's affirmation" },
      { status: 500 },
    );
  }
}
