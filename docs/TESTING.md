# Testing

## 1. Testing goals

The application should be checked at four levels:

1. Python generator
2. JSON data
3. frontend
4. GitHub Actions

## 2. Python syntax test

Run:

```bash
python -m py_compile generate_articles.py
```

Expected result:

- no output
- exit code 0

## 3. Generator test

Run:

```bash
python generate_articles.py
```

Expected behavior:

- RSS feeds are attempted;
- one unused article is selected;
- `data/articles.json` is updated;
- article contains all expected fields.

If today's article already exists, the script should not create a duplicate.

## 4. JSON validation

Run:

```bash
python -m json.tool data/articles.json
```

Expected result:

- valid JSON
- no parsing error

## 5. Local web test

Start a local server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Verify:

- page loads;
- article appears;
- category appears;
- date appears;
- summary appears;
- BBC link works;
- communication questions appear;
- vocabulary appears;
- history sidebar works.

## 6. Empty-data test

Set:

```json
[]
```

in `data/articles.json`.

Reload the website.

Expected result:

```text
No articles available yet.
```

The page should not display a JavaScript error to the user.

## 7. Duplicate test

Run the generator twice on the same day.

Expected behavior:

- first run creates today's article;
- second run reports that today's article already exists;
- no second entry is created.

## 8. Historical navigation test

Add two or more valid article objects to `articles.json`.

Reload the page.

Verify:

- newest article is displayed initially;
- each sidebar item is clickable;
- selecting an older article changes the main article;
- active state moves to the selected item.

## 9. Mobile test

Test approximately:

- 375px width
- 768px width
- desktop width

Verify that:

- sidebar does not overlap content;
- article remains readable;
- title scales down;
- buttons remain usable.

## 10. GitHub Actions test

Use:

```text
Actions
→ Daily BBC Article
→ Run workflow
```

Verify:

- workflow starts;
- Python executes;
- JSON is updated if needed;
- commit succeeds;
- GitHub Pages eventually serves the updated data.

## 11. Failure tests

Temporarily make one RSS URL invalid.

Expected behavior:

- that category reports a fetch failure;
- other feeds continue being processed;
- the whole generator does not fail solely because one feed is unavailable.

## 12. Regression rule

After changing the frontend, retest:

- initial load;
- article selection;
- external article link;
- mobile layout.

After changing the generator, retest:

- syntax;
- JSON;
- duplicate prevention;
- article selection;
- GitHub Action.
