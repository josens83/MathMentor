import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic } from "@/lib/claude/client";
import { GET_HINT_PROMPT } from "@/lib/claude/prompts";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problem, hintLevel = 1, currentWork } = await request.json();

    if (!problem) {
      return NextResponse.json(
        { error: "Problem is required" },
        { status: 400 }
      );
    }

    const userMessage = `
문제: ${problem}
힌트 레벨: ${hintLevel}
${currentWork ? `학생의 현재 풀이: ${currentWork}` : ""}

위 문제에 대해 레벨 ${hintLevel} 힌트를 제공해주세요.
`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: GET_HINT_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const content = message.content[0];
    const hint = content.type === "text" ? content.text : "";

    return NextResponse.json({ hint, hintLevel });
  } catch (error) {
    console.error("AI hint error:", error);
    return NextResponse.json(
      { error: "Failed to generate hint" },
      { status: 500 }
    );
  }
}
