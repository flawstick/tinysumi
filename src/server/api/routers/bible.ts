import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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

export const bibleRouter = createTRPCRouter({
  getDailyVerse: publicProcedure.query(async () => {
    try {
      const response = await fetch(
        "https://beta.ourmanna.com/api/v1/get?format=json&order=daily",
        {
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch daily verse",
        });
      }

      const data = (await response.json()) as OurMannaResponse;

      return {
        text: data.verse.details.text,
        reference: data.verse.details.reference,
        version: data.verse.details.version,
        verseUrl: data.verse.details.verseurl,
      };
    } catch (error) {
      console.error("Error fetching daily verse:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch daily verse",
      });
    }
  }),
});
