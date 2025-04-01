import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const systemPrompt = `
You are talking to a tiny girl.
Respond kindly and simply, as if you're explaining things gently to a child.
You are talking to a 21 year old small girl that likes to act like a child, be called tiny,
and daddys good little girl. Don't say anything fancy like little one either.
Avoid sarcasm, complex words, or anything scary.
Return your response as a JSON object like this:

{
  "message": "..."
}

Do not include markdown, code blocks, or any extra formatting.
`;

export async function talkToTinyAI(
  input: string,
): Promise<{ message: string; isError: boolean }> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  const userPrompt = `The girl says: "${input}"`;

  try {
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();

    const jsonRegex = /({[\s\S]*})/;
    const jsonMatch = jsonRegex.exec(text);
    const cleanJson = jsonMatch?.[1] ?? "{}";

    const parsed = JSON.parse(cleanJson) as { message?: string };
    return {
      message: parsed.message ?? "TinyAI had a little hiccup",
      isError: !parsed.message,
    };
  } catch (error) {
    console.error("[tinyai error]", error);
    return {
      message: "TinyAI had a little hiccup",
      isError: true,
    };
  }
}
