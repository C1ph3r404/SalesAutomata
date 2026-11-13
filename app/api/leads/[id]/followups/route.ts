import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { getLead, scheduleFollowup } from "@/lib/db/leads";
import { followupCreateSchema } from "@/lib/schemas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const lead = await getLead(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ followups: lead.followups });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const input = await readJson(request, followupCreateSchema);
    const followup = await scheduleFollowup(id, input);

    return NextResponse.json({ followup }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
