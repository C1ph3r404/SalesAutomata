import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { listWorkflows } from "@/lib/db/workflows";

export async function GET() {
  try {
    const workflows = await listWorkflows();

    return NextResponse.json({ workflows });
  } catch (error) {
    return jsonError(error);
  }
}
