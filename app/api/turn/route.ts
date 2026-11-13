import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { turnSchema } from "@/lib/schemas";
import { runTurn } from "@/lib/turn";

export async function POST(request: Request) {
  try {
    const input = await readJson(request, turnSchema);
    const result = await runTurn(input.leadId, input.message, input.channel);

    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error);
  }
}
