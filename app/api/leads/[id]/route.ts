import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { getLead, updateLead } from "@/lib/db/leads";
import { updateLeadSchema } from "@/lib/schemas";

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

    return NextResponse.json({ lead });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const input = await readJson(request, updateLeadSchema);
    const lead = await updateLead(id, input);

    return NextResponse.json({ lead });
  } catch (error) {
    return jsonError(error);
  }
}
