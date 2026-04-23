import { NextRequest } from "next/server";
import { submissionSchema } from "@/lib/schema";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    console.error("APPS_SCRIPT_URL not set — falling back to local log");
    return Response.json({ ok: true, stored: "none" });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      redirect: "follow",
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Apps Script error", res.status, text);
      return Response.json(
        { error: "Downstream write failed" },
        { status: 502 }
      );
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Apps Script fetch threw", err);
    return Response.json({ error: "Network error" }, { status: 502 });
  }
}
