import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { listUsers } from "@/lib/db/users";

export async function GET() {
  try {
    const users = await listUsers();

    return NextResponse.json({ users });
  } catch (error) {
    return jsonError(error);
  }
}
