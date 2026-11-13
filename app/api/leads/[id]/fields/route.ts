import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { updateLeadFields } from "@/lib/db/leads";
import { leadFieldsSchema } from "@/lib/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const input = await readJson(request, leadFieldsSchema);
    const lead = await updateLeadFields(id, input);

    return NextResponse.json({ lead });
  } catch (error) {
    return jsonError(error);
  }
}
