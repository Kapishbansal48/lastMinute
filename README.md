Burndown — The Last-Minute Life Saver
Problem
Most productivity tools treat a deadline like a calendar entry: a date, a notification, and nothing else. They tell you what is due and when, but not what to actually do about it. As a result, reminders pile up, get dismissed, and the work that was due "next week" quietly becomes the work that's due "in three hours." The gap isn't awareness — it's the missing bridge between knowing a deadline exists and knowing the next concrete move to make toward it.

Solution
Burndown is an AI-powered task companion built around one rule: at any moment, the user should know exactly one thing to do next — not a list to triage themselves. Instead of a passive backlog, it continuously recalculates urgency and surfaces a single, specific next action at the top of the screen, written as an instruction rather than a label ("Open the report and do one 15-minute push" instead of "Report — due today").

Tasks that sit too long without progress get flagged for breakdown into smaller first steps, lowering the activation energy to start. The rest of the queue is ranked and visualized by a combination of time remaining and stakes, so the user always sees what's actually burning versus what can wait.

Core Features
Single next-action hero panel — the AI's top recommendation, always one specific instruction, not a list.
Urgency-and-stakes ranking — tasks are scored by a combination of time-to-deadline and importance ("low / normal / high" stakes), not just due date.
Visual burn-rate indicators — a heat-coded progress bar per task shows how close it is to its deadline at a glance.
Autonomous task breakdown — tasks idling without progress are offered a one-tap split into a smaller, concrete first step.
Voice capture — tasks can be added by dictation for fast, low-friction logging in the moment.
Live countdowns — every task shows time remaining in human terms (days/hours/minutes), updating dynamically rather than showing a static due date.
How It Addresses the Brief
Brief requirement	How Burndown delivers it
Intelligent task prioritization	Urgency score combines deadline proximity and stakes weighting
AI-powered scheduling assistance	Next-action engine recommends what to do, not just when
Context-aware reminders	The hero panel adapts its instruction based on how much time is left
Autonomous task planning	One-tap breakdown turns vague tasks into an actionable first step
Voice-enabled assistance	Built-in dictation entry point for adding tasks hands-free
Goal/habit tracking	Cleared tasks log to a "Cleared" history, reinforcing completion
Current Implementation
The current build is a functional front-end prototype (React, single component, no backend) using mock in-memory data to demonstrate the prioritization logic, next-action generation, and breakdown flow end-to-end. It is designed to be extended with:

A real LLM call (e.g. via the Anthropic API) to generate more nuanced, context-specific next actions and task breakdowns instead of rule-based templates.
Calendar integration (Google Calendar / Outlook) for automatic deadline ingestion and conflict-aware scheduling.
Persistent storage and user accounts.
Real speech-to-text for the voice capture feature.
Push notifications timed to the urgency model rather than fixed intervals.
Tech Stack
Frontend: React (functional components, hooks-based state)
Icons: lucide-react
Styling: Inline CSS-in-JS, custom design system (no UI framework dependency)
Planned backend: Anthropic API for AI-generated next actions and task breakdown; calendar provider APIs for scheduling sync
Evaluation Notes
The design intentionally avoids a generic to-do list UI. The differentiator being demonstrated is decision support, not storage: the product's job is to remove the "what should I work on right now" decision from the user entirely, replacing it with a single, always-current answer.
