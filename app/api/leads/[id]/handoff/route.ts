import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { handoffLead } from "@/lib/db/leads";
import { handoffSchema } from "@/lib/schemas";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const input = await readJson(request, handoffSchema);
    const lead = await handoffLead(id, input);

    return NextResponse.json({ lead });
  } catch (error) {
    return jsonError(error);
  }
}
