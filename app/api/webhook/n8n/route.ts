import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { createLead } from "@/lib/db/leads";
import { createLeadSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = await readJson(request, createLeadSchema);
    const lead = await createLead(input);

    return NextResponse.json(
      {
        ok: true,
        leadId: lead.id,
        lead,
        webhook: "n8n",
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error);
  }
}
