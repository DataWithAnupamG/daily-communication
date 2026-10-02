# Agent Instructions

This document defines how an AI coding agent should work on this repository.

## 1. Understand the project first

The product is a personal daily communication-practice application.

The primary purpose is learning and speaking practice, not general news aggregation.

Before making changes, read:

1. `README.md`
2. `docs/PRD.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DESIGN_SYSTEM.md`
5. `docs/SECURITY.md`
6. `docs/TESTING.md`

## 2. Preserve the architecture

Prefer the existing stack:

- HTML
- CSS
- vanilla JavaScript
- Python standard library
- GitHub Actions
- GitHub Pages
- JSON data

Do not introduce a framework, database, or backend without a clear requirement.

## 3. Minimal-change principle

If a requested change affects one feature, avoid rewriting unrelated working features.

Do not change:

- layout
- colors
- article workflow
- automation
- data schema

unless required by the request.

## 4. Data contract

Do not silently rename existing article fields.

Expected article fields:

```text
date
source
category
title
summary
url
published
opinionPrompt
questions
vocabulary
```

If a schema change is required, update:

- generator
- frontend
- tests
- documentation

together.

## 5. Frontend rules

Use semantic HTML.

Escape externally sourced strings before injecting them into HTML.

External article links should use:

```html
target="_blank"
rel="noopener noreferrer"
```

Do not put arbitrary executable HTML from an RSS feed directly into the page.

## 6. Generator rules

The generator should:

- handle feed failures gracefully;
- avoid duplicate article URLs;
- avoid crashing because one category feed fails;
- preserve existing JSON records;
- use UTF-8;
- write deterministic valid JSON structure.

Do not scrape the full BBC article body.

## 7. GitHub Actions rules

Keep permissions minimal.

The workflow currently requires repository content write access because it commits the generated JSON.

Do not add unrelated secrets.

Do not log credentials or tokens.

## 8. Documentation rules

When architecture or behavior changes, update the appropriate document under `docs/`.

## 9. Testing rules

Before declaring a change complete:

- run Python compilation;
- run the generator;
- validate JSON;
- verify the frontend can load the generated data;
- check the GitHub workflow YAML;
- verify duplicate handling.

## 10. Communication style for agents

When modifying the project, report:

- what changed;
- why it changed;
- files changed;
- tests performed;
- known limitations.

Avoid claiming a test passed if it was not actually run.
