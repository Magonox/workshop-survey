"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Landing } from "@/components/Landing";
import { EmailGate } from "@/components/EmailGate";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionChoice } from "@/components/QuestionChoice";
import { QuestionMulti } from "@/components/QuestionMulti";
import { QuestionSlider } from "@/components/QuestionSlider";
import { QuestionStars } from "@/components/QuestionStars";
import { CommentBox } from "@/components/CommentBox";
import { Celebration } from "@/components/Celebration";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import {
  QUESTION_VERSION,
  baseOrder,
  frequencyBranch,
  getQuestion,
  showWantsChat,
  type QuestionId,
  type Question,
} from "@/lib/questions";

type Phase = "landing" | "email" | "questions" | "comment" | "celebration" | "results";

type AnswerMap = {
  mode_excited: string | null;
  role: string | null;
  blocker: string | null;
  next_topic: string | null;
  frequency: number | null;
  take_on_ai: string | null;
  confidence: number | null;
  use_cases: string[] | null;
  aha_mode: string | null;
  active_project: string | null;
  wants_chat: string | null;
  nps: number | null;
  interests: string[];
  stars: number | null;
};

const initialAnswers: AnswerMap = {
  mode_excited: null,
  role: null,
  blocker: null,
  next_topic: null,
  frequency: null,
  take_on_ai: null,
  confidence: null,
  use_cases: null,
  aha_mode: null,
  active_project: null,
  wants_chat: null,
  nps: null,
  interests: [],
  stars: null,
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers);
  const [comment, setComment] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const flow = useMemo<QuestionId[]>(() => {
    const out: QuestionId[] = [];
    for (const id of baseOrder) {
      out.push(id);
      if (id === "frequency") {
        const branch = frequencyBranch(answers.frequency);
        if (branch) out.push(branch);
      }
      if (id === "active_project") {
        if (showWantsChat(answers.active_project)) out.push("wants_chat");
      }
    }
    return out;
  }, [answers.frequency, answers.active_project]);

  const currentId = flow[qIndex];
  const q = currentId ? getQuestion(currentId) : null;
  const progress = flow.length > 0 ? (qIndex + 1) / (flow.length + 1) : 0;
  const currentAnswered = currentId ? isAnswered(currentId, answers) : false;

  const next = () => {
    if (qIndex + 1 >= flow.length) setPhase("comment");
    else setQIndex(qIndex + 1);
  };

  const back = () => {
    if (qIndex === 0) setPhase("email");
    else setQIndex(qIndex - 1);
  };

  const submit = async () => {
    setSubmitting(true);
    const payload = {
      email,
      mode_excited: answers.mode_excited!,
      role: answers.role!,
      blocker: answers.blocker!,
      next_topic: answers.next_topic!,
      frequency: answers.frequency!,
      take_on_ai: answers.take_on_ai,
      confidence: answers.confidence,
      use_cases: answers.use_cases,
      aha_mode: answers.aha_mode!,
      active_project: answers.active_project!,
      wants_chat: answers.wants_chat,
      nps: answers.nps!,
      interests: answers.interests,
      stars: answers.stars!,
      comment: comment.trim() || null,
      version: QUESTION_VERSION,
    };
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* swallow */
    }
    setSubmitting(false);
    setPhase("celebration");
  };

  return (
    <>
      <AuroraBackground />
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex"
            >
              <Landing onStart={() => setPhase("email")} />
            </motion.div>
          )}

          {phase === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex"
            >
              <EmailGate
                onSubmit={(e) => {
                  setEmail(e);
                  setPhase("questions");
                }}
              />
            </motion.div>
          )}

          {phase === "questions" && q && (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="w-full max-w-2xl mx-auto px-6 pt-8">
                <div className="flex items-center justify-between mb-3 text-xs text-muted">
                  <span>
                    Question {qIndex + 1} of ~{flow.length}
                  </span>
                  <button
                    onClick={back}
                    className="hover:text-ink transition-colors"
                  >
                    ← Back
                  </button>
                </div>
                <ProgressBar value={progress} />
              </div>

              <div className="flex-1 flex items-center justify-center px-6 py-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentId}
                    initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    {renderQuestion(q, answers, setAnswers)}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="w-full max-w-2xl mx-auto px-6 pb-10">
                <motion.button
                  onClick={next}
                  disabled={!currentAnswered}
                  whileHover={currentAnswered ? { scale: 1.01 } : undefined}
                  whileTap={currentAnswered ? { scale: 0.99 } : undefined}
                  className="w-full py-4 rounded-2xl bg-brand text-white font-semibold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-colors hover:bg-brand-deep"
                >
                  {qIndex + 1 === flow.length ? "Almost done →" : "Next →"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === "comment" && (
            <motion.div
              key="comment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex items-center justify-center px-6 py-10">
                <CommentBox value={comment} onChange={setComment} />
              </div>
              <div className="w-full max-w-2xl mx-auto px-6 pb-10 flex gap-3">
                <button
                  onClick={() => setPhase("questions")}
                  className="px-5 py-4 text-muted hover:text-ink transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex-1 py-4 rounded-2xl bg-brand text-white font-semibold disabled:opacity-60 transition-colors hover:bg-brand-deep"
                >
                  {submitting ? "Sending…" : "Submit & see results →"}
                </button>
              </div>
            </motion.div>
          )}

          {phase === "celebration" && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex"
            >
              <Celebration onDone={() => setPhase("results")} />
            </motion.div>
          )}

          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col"
            >
              <ResultsDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

function isAnswered(id: QuestionId, a: AnswerMap): boolean {
  switch (id) {
    case "mode_excited":
    case "role":
    case "blocker":
    case "next_topic":
    case "take_on_ai":
    case "aha_mode":
    case "active_project":
    case "wants_chat":
      return a[id] != null && a[id] !== "";
    case "frequency":
      return a.frequency != null;
    case "confidence":
      return a.confidence != null;
    case "nps":
      return a.nps != null;
    case "stars":
      return a.stars != null;
    case "use_cases":
      return (a.use_cases?.length ?? 0) > 0;
    case "interests":
      return a.interests.length > 0;
  }
}

function renderQuestion(
  q: Question,
  answers: AnswerMap,
  setAnswers: React.Dispatch<React.SetStateAction<AnswerMap>>
) {
  if (q.kind === "choice") {
    return (
      <QuestionChoice
        questionId={q.id}
        title={q.title}
        subtitle={q.subtitle}
        options={q.options}
        value={answers[q.id as keyof AnswerMap] as string | null}
        onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
      />
    );
  }
  if (q.kind === "multi") {
    return (
      <QuestionMulti
        questionId={q.id}
        title={q.title}
        subtitle={q.subtitle}
        options={q.options}
        value={(answers[q.id as keyof AnswerMap] as string[] | null) ?? []}
        onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
      />
    );
  }
  if (q.kind === "slider") {
    return (
      <QuestionSlider
        title={q.title}
        subtitle={q.subtitle}
        min={q.min}
        max={q.max}
        step={q.step}
        leftLabel={q.leftLabel}
        rightLabel={q.rightLabel}
        stops={q.stops}
        value={answers[q.id as keyof AnswerMap] as number | null}
        onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
      />
    );
  }
  if (q.kind === "stars") {
    return (
      <QuestionStars
        title={q.title}
        subtitle={q.subtitle}
        labels={q.labels}
        value={answers.stars}
        onChange={(v) => setAnswers((a) => ({ ...a, stars: v }))}
      />
    );
  }
  return null;
}
