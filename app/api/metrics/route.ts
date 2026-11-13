import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { getMetrics } from "@/lib/db/metrics";

export async function GET() {
  try {
    const metrics = await getMetrics();

    return NextResponse.json({ metrics });
  } catch (error) {
    return jsonError(error);
  }
}
