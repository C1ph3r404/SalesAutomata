import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { bookAppointment, getLead } from "@/lib/db/leads";
import { appointmentCreateSchema } from "@/lib/schemas";

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

    return NextResponse.json({ appointments: lead.appointments });
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
    const input = await readJson(request, appointmentCreateSchema);
    const result = await bookAppointment(id, input);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
