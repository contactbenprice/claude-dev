# Voice Interview Tool (working name)

## What this is

A simple web tool for async voice interviews. I send a parent a private link. They answer a few questions by recording short voice notes on their phone, whenever it suits them. After each answer, the tool can ask one smart follow-up question to get past the first polite answer and into a real story.

First use: user research for KaleKids, a kids' mealtime app. About 10 to 15 families, two rounds (a short baseline before they use the app, a longer one after). Later I want to reuse it for other projects, so keep questions as editable data, not hardcoded into the pages.

## Who I am and how to work with me

I'm a product marketer, not an engineer. This is my first build with Claude Code.

- Plan before you code. Show me the plan for each step and wait for my OK.
- Build one step at a time, then stop so I can test it on my iPhone.
- Explain what you did in plain language, like I'm new to this. Spell out jargon once.
- Pick the simplest option that works. If you're choosing between tools, tell me the tradeoff in two sentences and recommend one.
- After each working step, commit with git so we have a save point.
- Never put API keys in the code or in chat. Use environment variables and walk me through setting them up.
- When a step is done, update the Progress Log at the bottom of this file.

## Jobs to be done

Parent (respondent): When I'm asked to give feedback, I want to answer by talking, on my own time, so I can help without scheduling a call.

Me (researcher): When I can't run live interviews, I want async answers that dig past the first polite reply, so I get real stories about what happened instead of opinions.

## How it works

Parent flow:
1. Opens their private link on their phone. No account, no login.
2. Sees a short welcome screen: who's asking, roughly how long it takes, what gets recorded, how it's used, and that they can stop anytime. One button to start.
3. Sees one question at a time (text on screen). Taps record, talks, taps stop. Can re-record before submitting. Can type instead if they prefer.
4. If their answer is vague or general, the tool asks one follow-up question. They answer it the same way, or skip it.
5. Moves to the next question. Progress shown (e.g., "2 of 3").
6. Sees a thank-you screen at the end.
7. If they leave halfway, they can come back to the same link and pick up where they stopped.

Researcher flow (me):
1. A private page, protected by a simple password, where I can see each family's answers: the question, the transcript, the follow-up and its answer, and a way to play the audio.
2. One button to export everything to a CSV (spreadsheet) file.
3. A simple way to create a new participant link with a research ID (like KK001) and pick which question set they get.

## The AI follow-up (the most important feature)

After each answer is transcribed, send the question and the transcript to Claude and ask it to decide whether a follow-up is needed.

Rules for the follow-up, based on The Mom Test by Rob Fitzpatrick:
- Ask at most ONE follow-up per question. Respect the parent's time.
- Only ask if the answer is general, hypothetical, or an opinion ("usually," "always," "I think," "it would be nice"). If they already told a specific story about something that happened, skip the follow-up.
- The follow-up must ask about something that actually happened, in the past. Example: "You said dinners are usually rough. What happened the last time?"
- Never lead. Never suggest an answer, never mention the product's intended benefits, never ask "would you use" or "would you pay."
- Keep it under 20 words, warm and casual.
- Return either the follow-up text or "none."

## Question sets (store as editable data)

Baseline (about 5 minutes):
1. Tell me about your last dinner at home. What happened?
2. The last time your kid didn't want to eat what you served, what did you do?
3. What have you tried to make meals go better? How did that work out?

Final (about 10 minutes):
1. Tell me about the meal where KaleKids felt most different. What happened?
2. Was there a meal where it didn't help, or got in the way?
3. Did your kid ever ask for it without you bringing it up? What did they say?
4. If KaleKids disappeared tomorrow, what would you miss, if anything?
5. If you could change one thing, what would it be?

## Must-haves for v1

- Private link per participant, tied to a research ID
- Welcome and consent screen
- One question at a time, voice recording with playback and re-record, typed answer as an option
- Save audio and transcribe it
- One AI follow-up when needed, skippable
- Resume where they left off
- Researcher page with password, playback, transcripts, CSV export
- Create new participant links

## Not building (non-goals)

- No participant accounts or logins
- No dashboards, charts, or sentiment analysis
- No automatic segmentation or summaries (I'll analyze separately)
- No recordings or data collected from children directly. Parents only.
- No email sending. I'll share links myself by text.

## Constraints

- Must work well in Safari on iPhone. That's where parents will be. Test microphone permissions early, since that's the most likely thing to break.
- Deploy on Vercel (I already have an account connected).
- Collect as little personal data as possible. Use research IDs, not names, in the stored answers.
- Keep costs near zero for 15 participants. Tell me what each paid service will roughly cost.
- Transcription: Claude's API doesn't transcribe audio itself, as far as I know, so recommend a transcription service and explain why.

## Build order (stop after each step so I can test)

1. One hardcoded question on a page. Record, play back, re-record. Test on iPhone Safari.
2. Save the recording and transcribe it. Show me the transcript.
3. Add the AI follow-up for that one question.
4. Load questions from data, add progress, welcome screen, thank-you screen, and resume.
5. Unique participant links with research IDs.
6. Researcher page with password, playback, transcripts, and CSV export.
7. Deploy to Vercel and test the full flow end to end on my phone.

## Progress Log

(Update this after each step: what's done, what's next, any decisions made.)

- Not started.
