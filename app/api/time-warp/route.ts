import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { timeWarpFollowups } from "@/lib/db/leads";
import { timeWarpSchema } from "@/lib/schemas";

async function warp(request: Request) {
  const url = new URL(request.url);
  const input = timeWarpSchema.parse({
    days: url.searchParams.get("days") ?? 3,
  });
  const result = await timeWarpFollowups(input.days);

  return NextResponse.json(result);
}

export async function GET(request: Request) {
  try {
    return await warp(request);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    return await warp(request);
  } catch (error) {
    return jsonError(error);
  }
}
