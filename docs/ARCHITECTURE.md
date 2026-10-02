# Architecture

## 1. Overview

The application uses a static frontend plus a scheduled content-generation script.

```text
                    +----------------+
                    |   BBC RSS      |
                    |     Feeds      |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    | generate_      |
                    | articles.py    |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    | articles.json  |
                    |  Git repository |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    | GitHub Pages   |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    | Browser        |
                    | index.html     |
                    +----------------+
```

## 2. Frontend

Files:

- `index.html`
- `style.css`
- `app.js`

The frontend is framework-free.

`app.js` fetches:

```text
./data/articles.json
```

and renders the newest article.

## 3. Data storage

The first version uses:

```text
data/articles.json
```

as the data store.

This is appropriate because the project is intentionally a small personal application.

The repository itself becomes the persistence layer.

## 4. Content ingestion

`generate_articles.py`:

1. loads existing articles;
2. fetches configured RSS feeds;
3. parses RSS XML;
4. cleans HTML entities/tags from descriptions;
5. filters already-used URLs;
6. selects a category/article;
7. generates practice metadata;
8. appends the article;
9. saves JSON.

## 5. Automation

GitHub Actions runs:

```text
.github/workflows/daily-article.yml
```

Schedule:

```text
30 0 * * *
```

This is 00:30 UTC, which corresponds to 06:00 IST.

The workflow also supports manual execution.

## 6. Deployment

GitHub Pages serves the repository's static files.

No application server is required for the frontend.

## 7. Dependency model

Python generator dependencies:

- Python standard library only

Frontend dependencies:

- none

This keeps the application simple and reduces supply-chain exposure.

## 8. Data flow

The browser never contacts BBC directly to generate the page.

Instead:

```text
BBC RSS
   ↓
Python
   ↓
Git commit
   ↓
GitHub Pages
   ↓
Browser
```

The "Read Full Article" button sends the user to the original BBC URL.

## 9. Architectural constraints

Do not introduce a backend database unless a future requirement needs:

- multiple users
- user-specific progress
- authentication
- synchronized preferences
- large-scale history
- analytics

For those requirements, the architecture can evolve to a hosted backend/database.
