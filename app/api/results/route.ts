import type { Aggregate } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMPTY: Aggregate = {
  count: 0,
  byChoice: {},
  bySliderAvg: {},
  byMulti: {},
  stars: { avg: 0, count: 0, dist: [0, 0, 0, 0, 0] },
  nps: { promoters: 0, passives: 0, detractors: 0, score: 0 },
};

export async function GET() {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) return Response.json(EMPTY);

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });
    if (!res.ok) return Response.json(EMPTY);
    const data = (await res.json()) as Aggregate;
    return Response.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return Response.json(EMPTY);
  }
}
