import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic } from "@/lib/claude/client";
import { GET_HINT_PROMPT } from "@/lib/claude/prompts";
import { hintRequestSchema, safeParse } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    // 1. Authentication check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const validation = safeParse(hintRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", code: "VALIDATION_ERROR", details: validation.errors },
        { status: 400 }
      );
    }

    const { problem, hintLevel, currentWork } = validation.data;

    // 3. Check subscription tier for hint level access
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, gems")
      .eq("id", user.id)
      .single();

    // Level 3 hints require Pro subscription or gems
    if (hintLevel === 3 && profile?.subscription_tier === "free") {
      if ((profile.gems ?? 0) < 10) {
        return NextResponse.json(
          { error: "Insufficient gems for detailed hint", code: "INSUFFICIENT_GEMS" },
          { status: 403 }
        );
      }
      // Deduct gems for free users
      await supabase
        .from("profiles")
        .update({ gems: (profile.gems ?? 0) - 10 })
        .eq("id", user.id);
    }

    // 4. Generate hint with Claude
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
    const hint = content?.type === "text" ? content.text : "";

    // 5. Return response
    return NextResponse.json({
      hint,
      hintLevel,
      gemsUsed: hintLevel === 3 && profile?.subscription_tier === "free" ? 10 : 0,
    });
  } catch (error) {
    // Log error without exposing details to client
    console.error("AI hint error:", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json(
      { error: "Failed to generate hint", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
