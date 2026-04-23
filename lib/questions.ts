export type ChoiceOption = {
  value: string;
  label: string;
  emoji?: string;
};

export type Question =
  | {
      id: string;
      kind: "choice";
      title: string;
      subtitle?: string;
      options: ChoiceOption[];
    }
  | {
      id: string;
      kind: "multi";
      title: string;
      subtitle?: string;
      options: ChoiceOption[];
    }
  | {
      id: string;
      kind: "slider";
      title: string;
      subtitle?: string;
      min: number;
      max: number;
      step: number;
      leftLabel: string;
      rightLabel: string;
      stops?: string[];
    }
  | {
      id: string;
      kind: "stars";
      title: string;
      subtitle?: string;
      labels: string[];
    };

export type QuestionId =
  | "mode_excited"
  | "role"
  | "blocker"
  | "next_topic"
  | "frequency"
  | "take_on_ai"
  | "confidence"
  | "use_cases"
  | "aha_mode"
  | "active_project"
  | "wants_chat"
  | "nps"
  | "interests"
  | "stars";

export const QUESTION_VERSION = "1.0.0";

export const questions: Question[] = [
  {
    id: "mode_excited",
    kind: "choice",
    title: "Which mode are you most excited to use this week?",
    subtitle: "Pick the one that surprised you — or the one you can't wait to try.",
    options: [
      { value: "chat", label: "Chat", emoji: "💬" },
      { value: "cowork", label: "Cowork", emoji: "🤝" },
      { value: "code", label: "Code", emoji: "💻" },
      { value: "undecided", label: "Still deciding", emoji: "🤔" },
    ],
  },
  {
    id: "role",
    kind: "choice",
    title: "What best describes you?",
    options: [
      { value: "founder", label: "Founder", emoji: "🚀" },
      { value: "builder", label: "Builder / Developer", emoji: "🛠️" },
      { value: "consultant", label: "Consultant", emoji: "🎯" },
      { value: "ops", label: "Ops / Manager", emoji: "📋" },
      { value: "other", label: "Other", emoji: "✨" },
    ],
  },
  {
    id: "blocker",
    kind: "choice",
    title: "What's your biggest blocker to getting more out of AI?",
    options: [
      { value: "use_cases", label: "Knowing what to use it for", emoji: "🧠" },
      { value: "setup", label: "Setting it up", emoji: "🛠️" },
      { value: "trust", label: "Trust & privacy", emoji: "🔐" },
      { value: "time", label: "Time to learn", emoji: "⏱️" },
      { value: "cost", label: "Cost", emoji: "💰" },
    ],
  },
  {
    id: "next_topic",
    kind: "choice",
    title: "Which topic would you want to go deeper on next?",
    subtitle: "Your vote shapes the next workshop.",
    options: [
      { value: "agents", label: "Building AI agents", emoji: "🤖" },
      { value: "tools", label: "AI tools tour", emoji: "🧰" },
      { value: "content", label: "AI for content & marketing", emoji: "✍️" },
      { value: "privacy", label: "Privacy & running models locally", emoji: "🔒" },
      { value: "workflows", label: "Custom workflows & automation", emoji: "🧩" },
    ],
  },
  {
    id: "frequency",
    kind: "slider",
    title: "How often do you use AI tools in a typical week?",
    min: 0,
    max: 4,
    step: 1,
    leftLabel: "Rarely",
    rightLabel: "Co-pilot",
    stops: [
      "Rarely",
      "Few times a week",
      "Daily",
      "Many times a day",
      "It's my co-pilot",
    ],
  },
  // Q6 branches (one of these will be inserted based on frequency answer)
  {
    id: "take_on_ai",
    kind: "choice",
    title: "What's your current take on AI?",
    subtitle: "Totally honest answers welcome.",
    options: [
      { value: "skeptical", label: "Skeptical", emoji: "🤨" },
      { value: "curious", label: "Curious but cautious", emoji: "😮" },
      { value: "overwhelmed", label: "Overwhelmed", emoji: "🤯" },
      { value: "no_time", label: "Just haven't had time", emoji: "⏳" },
    ],
  },
  {
    id: "confidence",
    kind: "slider",
    title: "How confident do you feel using AI?",
    min: 1,
    max: 10,
    step: 1,
    leftLabel: "Totally lost",
    rightLabel: "Fully in control",
  },
  {
    id: "use_cases",
    kind: "multi",
    title: "What are your top AI use cases?",
    subtitle: "Pick as many as fit.",
    options: [
      { value: "writing", label: "Writing", emoji: "✍️" },
      { value: "coding", label: "Coding", emoji: "💻" },
      { value: "research", label: "Research", emoji: "🔍" },
      { value: "analysis", label: "Analysis", emoji: "📊" },
      { value: "brainstorm", label: "Brainstorming", emoji: "💡" },
      { value: "customer", label: "Customer work", emoji: "🎧" },
      { value: "admin", label: "Admin tasks", emoji: "🗂️" },
      { value: "other", label: "Other", emoji: "✨" },
    ],
  },
  // End Q6 branches
  {
    id: "aha_mode",
    kind: "choice",
    title: "Which mode was the biggest 'aha' for you today?",
    subtitle: "Pick honestly — even the 'none' answer is useful.",
    options: [
      { value: "chat", label: "Chat", emoji: "💬" },
      { value: "cowork", label: "Cowork", emoji: "🤝" },
      { value: "code", label: "Code", emoji: "💻" },
      { value: "none", label: "Honestly, none of them clicked yet", emoji: "🤷" },
    ],
  },
  {
    id: "active_project",
    kind: "choice",
    title: "Are you working on something AI-related right now?",
    options: [
      { value: "building", label: "Yes, actively building", emoji: "🚀" },
      { value: "planning", label: "Planning / exploring", emoji: "🧭" },
      { value: "curious", label: "Just curious, nothing yet", emoji: "💭" },
      { value: "no", label: "Not really my world", emoji: "🙅" },
    ],
  },
  {
    id: "wants_chat",
    kind: "choice",
    title: "Want to chat about it?",
    subtitle: "No pressure — just an open door for a quick 15-minute call.",
    options: [
      { value: "yes", label: "Yes, I'm open", emoji: "✅" },
      { value: "no", label: "Not right now", emoji: "❌" },
    ],
  },
  {
    id: "nps",
    kind: "slider",
    title: "How likely are you to recommend this workshop to a colleague?",
    min: 0,
    max: 10,
    step: 1,
    leftLabel: "Never",
    rightLabel: "Already texting them",
  },
  {
    id: "interests",
    kind: "multi",
    title: "Want to stay in the loop?",
    subtitle: "Tick anything that's a yes.",
    options: [
      { value: "next_workshop", label: "Next workshop invite", emoji: "✉️" },
      { value: "newsletter", label: "Everyday A.I. newsletter", emoji: "📬" },
      { value: "playbook", label: "Claude Desktop playbook PDF", emoji: "🎁" },
      { value: "consulting", label: "1-on-1 consulting intro", emoji: "🤝" },
      { value: "none", label: "No thanks, just here for today", emoji: "🙅" },
    ],
  },
  {
    id: "stars",
    kind: "stars",
    title: "How valuable was today's workshop for you?",
    subtitle: "The number that ends up on the landing page of the next one.",
    labels: [
      "Not for me",
      "Some sparks",
      "Solid",
      "Really valuable",
      "Game-changer",
    ],
  },
];

// Linear order shown to users: mode_excited → role → blocker → next_topic → frequency
// → (branch) → aha_mode → active_project → (maybe wants_chat) → nps → interests → stars
export const baseOrder: QuestionId[] = [
  "mode_excited",
  "role",
  "blocker",
  "next_topic",
  "frequency",
  // branch slot handled dynamically
  "aha_mode",
  "active_project",
  // wants_chat conditional
  "nps",
  "interests",
  "stars",
];

export function frequencyBranch(
  freqValue: number | null | undefined
): QuestionId | null {
  if (freqValue == null) return null;
  if (freqValue === 0) return "take_on_ai"; // Rarely
  if (freqValue === 1) return "confidence"; // Few times a week
  return "use_cases"; // Daily / Many / Co-pilot
}

export function showWantsChat(activeProject: string | null | undefined) {
  return activeProject === "building";
}

export function getQuestion(id: QuestionId): Question {
  const q = questions.find((q) => q.id === id);
  if (!q) throw new Error(`Question ${id} not found`);
  return q;
}
