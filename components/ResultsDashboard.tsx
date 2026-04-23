"use client";

import { ResponsiveBar } from "@nivo/bar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Aggregate } from "@/lib/schema";
import { questions } from "@/lib/questions";

const EMPTY: Aggregate = {
  count: 0,
  byChoice: {},
  bySliderAvg: {},
  byMulti: {},
  stars: { avg: 0, count: 0, dist: [0, 0, 0, 0, 0] },
  nps: { promoters: 0, passives: 0, detractors: 0, score: 0 },
};

export function ResultsDashboard() {
  const [data, setData] = useState<Aggregate>(EMPTY);
  const [ticked, setTicked] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchIt = async () => {
      try {
        const r = await fetch("/api/results", { cache: "no-store" });
        if (!r.ok) return;
        const d = (await r.json()) as Aggregate;
        if (!mounted) return;
        setData(d);
        setTicked((n) => n + 1);
      } catch {
        /* ignore */
      }
    };
    fetchIt();
    const id = setInterval(fetchIt, 4000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">
            Live results
          </h2>
          <p className="mt-2 text-muted">
            {data.count} {data.count === 1 ? "response" : "responses"} · updates
            every 4 seconds
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-brand-deep">
          <span className="live-dot" />
          LIVE
        </div>
      </div>

      {data.count === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-2 border-dashed border-line rounded-3xl p-12 text-center"
        >
          <p className="text-muted">Waiting for the first response…</p>
          <p className="mt-2 text-xs text-muted">Tick #{ticked}</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <StatCard label="Workshop rating" value={data.stars.avg.toFixed(1)} suffix=" / 5" />
          <StatCard label="NPS" value={data.nps.score.toFixed(0)} suffix="" />
          <ChoiceChart
            questionId="mode_excited"
            title="Most excited to use this week"
            agg={data.byChoice.mode_excited || {}}
          />
          <ChoiceChart
            questionId="aha_mode"
            title="Biggest 'aha' today"
            agg={data.byChoice.aha_mode || {}}
          />
          <ChoiceChart
            questionId="next_topic"
            title="Next workshop topic"
            agg={data.byChoice.next_topic || {}}
          />
          <ChoiceChart
            questionId="blocker"
            title="Biggest blocker"
            agg={data.byChoice.blocker || {}}
          />
          <MultiChart
            questionId="interests"
            title="What they want next"
            agg={data.byMulti.interests || {}}
          />
          <ChoiceChart
            questionId="role"
            title="Who's in the room"
            agg={data.byChoice.role || {}}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-line rounded-3xl p-6"
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-5xl font-semibold text-ink tracking-tight">
        {value}
        <span className="text-2xl text-muted font-normal">{suffix}</span>
      </p>
    </motion.div>
  );
}

function ChoiceChart({
  questionId,
  title,
  agg,
}: {
  questionId: string;
  title: string;
  agg: Record<string, number>;
}) {
  const q = questions.find((x) => x.id === questionId);
  if (!q || (q.kind !== "choice" && q.kind !== "multi")) return null;

  const data = q.options.map((opt) => ({
    id: opt.value,
    label: opt.label,
    count: agg[opt.value] || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-line rounded-3xl p-5 md:col-span-1"
    >
      <h3 className="font-semibold text-ink mb-3">{title}</h3>
      <div style={{ height: Math.max(160, data.length * 40) }}>
        <ResponsiveBar
          data={data}
          keys={["count"]}
          indexBy="label"
          layout="horizontal"
          margin={{ top: 5, right: 30, bottom: 5, left: 160 }}
          padding={0.3}
          colors={["#ff6b35"]}
          borderRadius={6}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={{ tickSize: 0, tickPadding: 8 }}
          enableGridY={false}
          enableGridX={false}
          labelTextColor="#ffffff"
          motionConfig="wobbly"
          theme={{
            text: { fontFamily: "inherit", fontSize: 12, fill: "#1a1a1a" },
          }}
        />
      </div>
    </motion.div>
  );
}

function MultiChart({
  questionId,
  title,
  agg,
}: {
  questionId: string;
  title: string;
  agg: Record<string, number>;
}) {
  return <ChoiceChart questionId={questionId} title={title} agg={agg} />;
}
