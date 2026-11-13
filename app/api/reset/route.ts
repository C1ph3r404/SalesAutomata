import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { resetDemoData } from "@/lib/db/seed";

async function reset() {
  await resetDemoData();

  return NextResponse.json({ ok: true });
}

export async function GET() {
  try {
    return await reset();
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST() {
  try {
    return await reset();
  } catch (error) {
    return jsonError(error);
  }
}
