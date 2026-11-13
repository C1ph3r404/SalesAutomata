import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function readJson<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError("Validation failed", 422, parsed.error.flatten());
  }

  return parsed.data;
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.flatten() },
      { status: 422 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Already exists" }, { status: 409 });
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Related record does not exist" },
        { status: 400 },
      );
    }
  }

  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
