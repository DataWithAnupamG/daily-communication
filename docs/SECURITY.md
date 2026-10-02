# Security

## 1. Security model

This project is intentionally simple and mostly static.

There is no:

- user authentication
- database
- server-side application
- secret API key
- private user data

## 2. External content

RSS feed content is external/untrusted input.

The generator cleans descriptions before storing them.

The frontend uses `textContent` for article fields and HTML escaping for generated list/chip content.

Do not insert raw RSS HTML into the page.

## 3. External links

BBC article links open in a new tab with:

```html
rel="noopener noreferrer"
```

## 4. GitHub Actions permissions

The workflow uses:

```yaml
permissions:
  contents: write
```

This is required because the workflow commits the daily JSON file.

Do not grant additional permissions unless a future feature requires them.

## 5. Dependencies

The Python generator currently uses only the Python standard library.

This reduces third-party package and supply-chain risk.

The frontend has no external JavaScript dependency.

## 6. Secrets

The current application does not require secrets.

Do not put:

- API keys
- passwords
- access tokens
- personal credentials

inside source files.

## 7. Data privacy

The application stores article information only.

It does not currently collect:

- names
- email addresses
- recordings
- microphone data
- login information
- personal learning history

## 8. Future AI integration

If an AI service is added later:

- API keys must remain server-side;
- never expose a secret key in `app.js`;
- avoid sending private user information unnecessarily;
- validate external inputs;
- document data retention.

## 9. Content/licensing consideration

The application stores article metadata/summary data from RSS and links to the original BBC article rather than reproducing the full article.

Before expanding redistribution of article content, review the applicable BBC terms, RSS usage conditions, and licensing requirements.
