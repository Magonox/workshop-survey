import { z } from "zod";

export const submissionSchema = z.object({
  email: z.string().email().max(200),
  mode_excited: z.string().max(40),
  role: z.string().max(40),
  blocker: z.string().max(40),
  next_topic: z.string().max(40),
  frequency: z.number().int().min(0).max(4),
  take_on_ai: z.string().max(40).nullable().optional(),
  confidence: z.number().int().min(1).max(10).nullable().optional(),
  use_cases: z.array(z.string().max(40)).max(12).nullable().optional(),
  aha_mode: z.string().max(40),
  active_project: z.string().max(40),
  wants_chat: z.string().max(10).nullable().optional(),
  nps: z.number().int().min(0).max(10),
  interests: z.array(z.string().max(40)).max(12),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(2000).nullable().optional(),
  version: z.string().max(20),
});

export type Submission = z.infer<typeof submissionSchema>;

export type Aggregate = {
  count: number;
  byChoice: Record<string, Record<string, number>>;
  bySliderAvg: Record<string, { avg: number; count: number }>;
  byMulti: Record<string, Record<string, number>>;
  stars: { avg: number; count: number; dist: number[] };
  nps: { promoters: number; passives: number; detractors: number; score: number };
};
