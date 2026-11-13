import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { getUser } from "@/lib/db/users";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return jsonError(error);
  }
}
