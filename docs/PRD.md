# Product Requirements Document

## 1. Product name

Daily Communication Practice

## 2. Product summary

Daily Communication Practice is a personal learning web application that presents one current BBC News topic each day and converts it into structured speaking and conversation practice.

The goal is not to build a general news reader. The goal is to use a real-world topic as a prompt for communication practice.

## 3. Problem

A learner may know English vocabulary and grammar but still struggle to:

- explain something naturally
- speak continuously
- express an opinion
- give supporting reasons
- discuss unfamiliar topics
- use current vocabulary in conversation

The application provides a repeatable daily exercise.

## 4. Target user

Primary user:

- one learner practicing communication and spoken English
- desktop-first but mobile-compatible
- comfortable reading English news

## 5. Core user journey

1. Open the website.
2. See the latest daily article.
3. Read the short feed summary.
4. Open the full article on BBC.
5. Explain the article aloud.
6. Answer the opinion prompt.
7. Answer conversation questions.
8. Review useful vocabulary.
9. Select an older article from the sidebar for additional practice.

## 6. Functional requirements

### FR-01 Daily article

The system shall maintain one article per day.

### FR-02 Article source

The initial implementation shall use BBC News RSS feeds.

### FR-03 Category rotation

The generator should rotate across categories such as:

- Technology
- World
- Business
- Science
- Health
- India
- Entertainment
- Top Stories

### FR-04 Duplicate prevention

An article URL already stored in `data/articles.json` should not be selected again.

### FR-05 Archive

Previously generated articles shall remain in `data/articles.json` and appear in the sidebar.

### FR-06 Communication practice

Each article shall provide:

- explanation task
- opinion prompt
- conversation questions
- useful vocabulary

### FR-07 Full article access

The user shall have a link to the original BBC article.

### FR-08 Automation

GitHub Actions shall execute the generator once per day and commit new article data.

### FR-09 Manual execution

The workflow shall support `workflow_dispatch`.

### FR-10 Static hosting

The frontend shall be deployable using GitHub Pages.

## 7. Non-functional requirements

### Performance

The frontend should remain lightweight and load without a framework.

### Maintainability

HTML, CSS, JavaScript and Python should remain separated.

### Portability

The project should run on Windows, macOS and Linux with Python 3.x.

### Cost

The design should avoid requiring a paid backend or database.

## 8. Out of scope

The first version does not include:

- user accounts
- progress tracking
- database storage
- AI-generated summaries
- speech recognition
- pronunciation scoring
- mobile app
- notifications
- personalized recommendation models
- full article scraping

## 9. Future roadmap

Possible later versions:

1. Daily streak tracking.
2. Browser microphone recording.
3. Speech-to-text.
4. AI feedback on explanations.
5. Vocabulary difficulty levels.
6. User-selected categories.
7. Saved favorite articles.
8. Cloud database.
9. Authentication.
10. Personal learning analytics.

## 10. Success criteria

The first version is successful when:

- the website displays the latest generated article;
- the sidebar shows previous articles;
- the daily workflow runs automatically;
- duplicate URLs are avoided;
- the original BBC article can be opened;
- the communication exercise is usable without additional instructions.
