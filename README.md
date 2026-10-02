# Daily Communication Practice

A lightweight personal web application that turns one daily BBC News article into a communication-practice exercise.

The project is designed for improving:

- spoken English
- explanation skills
- opinion expression
- everyday conversation
- vocabulary
- awareness of current topics

## How it works

```text
BBC RSS feeds
     |
     v
Python generator
     |
     v
data/articles.json
     |
     v
GitHub Actions commits daily update
     |
     v
GitHub Pages
     |
     v
Web app
```

The website does not copy the full BBC article. It displays metadata/summary available through the feed and links the user to BBC for the full article.

## Project structure

```text
daily-communication/
├── .github/
│   └── workflows/
│       └── daily-article.yml
├── data/
│   └── articles.json
├── docs/
│   ├── PRD.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── AGENT_INSTRUCTIONS.md
│   ├── SECURITY.md
│   └── TESTING.md
├── app.js
├── generate_articles.py
├── index.html
├── style.css
└── README.md
```

## Run locally

From the project directory:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Do not open `index.html` directly with `file://` because browsers may block the JSON fetch.

To generate an article manually:

```bash
python generate_articles.py
```

## GitHub Pages

1. Push the project to a GitHub repository.
2. Open repository Settings.
3. Open Pages.
4. Select deployment from the `main` branch and `/root`.
5. Save.
6. Open the published Pages URL.

## Daily automation

The GitHub Action runs at:

```text
00:30 UTC
06:00 India Standard Time
```

It can also be started manually using **Actions → Daily BBC Article → Run workflow**.

## Data model

Each article entry contains:

- date
- source
- category
- title
- summary
- URL
- published timestamp
- opinion prompt
- conversation questions
- vocabulary

## Current scope

This is intentionally a small static application:

- no database
- no login
- no backend server
- no API key
- no JavaScript framework
- no build step

GitHub is used for source control, GitHub Actions provides scheduled automation, and GitHub Pages provides hosting.

See the `docs/` directory for the detailed product, architecture, design, security, agent, and testing documentation.
