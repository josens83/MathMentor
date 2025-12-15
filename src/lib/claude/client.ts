import Anthropic from "@anthropic-ai/sdk";

// Server-side only
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function askClaude(
  systemPrompt: string,
  userMessage: string,
  options?: {
    maxTokens?: number;
    model?: string;
  }
) {
  const message = await anthropic.messages.create({
    model: options?.model || "claude-sonnet-4-20250514",
    max_tokens: options?.maxTokens || 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = message.content[0];
  if (content.type === "text") {
    return content.text;
  }
  return "";
}
