import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { createLead, listLeads } from "@/lib/db/leads";
import {
  createLeadSchema,
  listLeadsQuerySchema,
} from "@/lib/schemas";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = listLeadsQuerySchema.parse(
      Object.fromEntries(url.searchParams.entries()),
    );
    const leads = await listLeads(query);

    return NextResponse.json({ leads });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = await readJson(request, createLeadSchema);
    const lead = await createLead(input);

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
