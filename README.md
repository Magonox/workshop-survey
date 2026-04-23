# Workshop Pulse — Everyday A.I.

Live, animated survey for the Claude Desktop workshop. Attendees drop their email, answer 10 adaptive questions, and watch the aggregate results come in on a live dashboard. Data persists to a Google Sheet via an Apps Script webhook — no database.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- Framer Motion (transitions, sliders, pills)
- Radix Slider (a11y)
- Nivo (animated bar charts)
- canvas-confetti + custom SVG tree (celebration)
- Zod (request validation)
- Google Apps Script (persistence + aggregation)

## Local dev

```bash
npm install
cp .env.example .env.local        # paste your Apps Script URL
npm run dev                       # http://localhost:3000
```

If `APPS_SCRIPT_URL` is empty the app still runs — submissions are dropped and the dashboard stays empty.

## One-time setup — Google Sheet + Apps Script

1. Create a new Google Sheet (name it anything, e.g. *Workshop Pulse*).
2. Extensions → **Apps Script**.
3. Replace the default `Code.gs` with the contents of [`apps-script/Code.gs`](./apps-script/Code.gs).
4. In the Apps Script editor, click **Run → `setup`** once. It will ask for permissions — grant them. This creates a `responses` tab with headers.
5. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the deployment URL (ends in `/exec`). That's your `APPS_SCRIPT_URL`.

## Deploy to Vercel

Vercel is already linked to this GitHub account.

1. `git push` the repo.
2. Vercel → **Add New Project** → import `Magonox/workshop-survey`.
3. Set env var: **`APPS_SCRIPT_URL`** = your `/exec` URL from step 6 above.
4. Deploy.
5. Every `git push` auto-deploys — edit [`lib/questions.ts`](./lib/questions.ts) live during the workshop to change questions on the fly.

## Iterating during the workshop

All 10 questions + branching rules live in **[`lib/questions.ts`](./lib/questions.ts)**. Changing wording, options, order, or branching is a one-file edit:

```ts
{
  id: "next_topic",
  kind: "choice",
  title: "Which topic would you want to go deeper on next?",
  options: [ ... ],
}
```

Push, wait ~30s for Vercel, tell the room to refresh.

## Sheet schema

`responses` tab columns: `timestamp | email | mode_excited | role | blocker | next_topic | frequency | take_on_ai | confidence | use_cases | aha_mode | active_project | wants_chat | nps | interests | stars | comment | version`

- `use_cases` and `interests` are pipe-delimited (`writing|research`).
- Conditional fields (`take_on_ai`, `confidence`, `use_cases`, `wants_chat`) are blank when not applicable.
- `version` lets you keep multiple survey iterations in the same sheet and filter later.

## Lead qualification playbook

Key lead filter: `active_project == "building"` AND `wants_chat == "yes"` → send a Calendly link that day.

Warm nurture: `interests` contains `consulting` or `playbook` → add to CRM.
