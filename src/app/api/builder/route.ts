import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { BUILDER_SYSTEM_PROMPT } from "@/lib/builder/builder-prompt";

const CREDITS_PER_WEEK = 5;
const TTL_SECONDS = 604800; // 7 days

function getClientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "127.0.0.1")
    .split(",")[0]
    .trim();
}

function isBypassedIp(ip: string): boolean {
  // Always bypass in local dev
  if (ip === "127.0.0.1" || ip === "::1") return true;

  const raw = process.env.RATE_LIMIT_BYPASS_IPS;
  if (!raw) return false;
  const bypassed = raw.split(",").map((s) => s.trim());
  return bypassed.includes(ip);
}

async function checkCredits(ip: string): Promise<{
  allowed: boolean;
  used: number;
}> {
  // Skip credit check for bypassed IPs
  if (isBypassedIp(ip)) {
    return { allowed: true, used: 0 };
  }

  // Skip credit check if Redis is not configured (local dev)
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return { allowed: true, used: 0 };
  }

  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    const key = `builder:${ip}`;
    const used = await redis.incr(key);

    if (used === 1) {
      await redis.expire(key, TTL_SECONDS);
    }

    if (used > CREDITS_PER_WEEK) {
      await redis.decr(key);
      return { allowed: false, used: CREDITS_PER_WEEK };
    }

    return { allowed: true, used };
  } catch {
    // Fail open: if Redis is unreachable, allow the request
    return { allowed: true, used: 0 };
  }
}

export async function POST(req: Request) {
  // 1. Validate request body before consuming a credit
  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const prompt = body?.prompt?.trim();
  if (!prompt || typeof prompt !== "string") {
    return Response.json({ error: "invalid_prompt" }, { status: 400 });
  }

  if (prompt.length > 500) {
    return Response.json({ error: "prompt_too_long" }, { status: 400 });
  }

  // 2. Credit check
  const ip = getClientIp(req);
  const { allowed } = await checkCredits(ip);

  if (!allowed) {
    return Response.json({ error: "limit_reached" }, { status: 429 });
  }

  // 3. Stream from LLM
  try {
    const result = streamText({
      model: anthropic("claude-opus-4-6"),
      system: BUILDER_SYSTEM_PROMPT,
      prompt: `Create a beautiful, production-quality Solana app interface for: ${prompt}`,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error("LLM stream error:", err);
    return Response.json(
      { error: "Failed to generate. Please try again." },
      { status: 500 },
    );
  }
}
