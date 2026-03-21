# Resources

Guides, cheat sheets, and references.

## Claude Code Cheat Sheet

### Running Commands
Type `! <command>` in the Claude Code input to run terminal commands directly.
Example: `! git status`

### Saving Your Work to GitHub
```
! git add .
! git commit -m "describe what you did"
! git push
```
Or all at once: `! git add . && git commit -m "your message" && git push`

### Key Slash Commands
| Command | What it does |
|---------|-------------|
| `/help` | Full list of commands |
| `/clear` | Reset conversation (keeps your files, clears chat) |
| `/compact` | Summarize long chat to free up space |
| `/cost` | See token usage for this session |
| `/config` | Change settings (theme, model, output style) |

### Git Basics
| Command | What it does |
|---------|-------------|
| `git status` | See what files have changed |
| `git add .` | Stage all changed files |
| `git commit -m "message"` | Save a snapshot with a description |
| `git push` | Upload snapshot to GitHub |
| `git log` | See history of all snapshots |

## Deploying to Vercel (making a site live on the internet)
1. Log in once: `! vercel login` (opens browser)
2. From your site folder: `! vercel` (follow prompts)
3. Every future update: `! vercel --prod`

## Key Links
- My GitHub: https://github.com/contactbenprice
- My Repo: https://github.com/contactbenprice/claude-dev
- My resume site folder: work/job-search/resume-site/
- Claude Code Docs: https://docs.anthropic.com/claude-code
