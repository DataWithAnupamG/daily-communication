# Design System

## 1. Design direction

The application should feel like a focused personal learning tool rather than a news portal.

Design principles:

- clean
- calm
- readable
- low visual noise
- content first
- clear learning actions

## 2. Layout

Desktop:

```text
+------------------+------------------------------+
|                  |                              |
| Previous         | Article                      |
| Articles         |                              |
|                  | Communication Practice       |
|                  |                              |
+------------------+------------------------------+
```

The sidebar is fixed on desktop and becomes a normal top section on smaller screens.

## 3. Colors

Current palette:

- Page background: `#f5f7fb`
- Surface: `#ffffff`
- Primary text: `#202124`
- Secondary text: `#555555`
- Muted text: `#777777`
- Category background: `#e8f0fe`
- Category text: `#1967d2`
- BBC article button: `#b91c1c`
- Practice surface: `#f8fafc`
- Borders: `#e5e7eb`

## 4. Typography

Preferred font stack:

```css
Inter,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif
```

Article title:

- large
- strong
- approximately 42px desktop

Summary:

- approximately 19px
- relaxed line height

Sidebar article titles:

- approximately 14px
- semibold

## 5. Components

### Brand

The product name and simple communication icon.

### Category badge

Rounded pill identifying the article category.

### Article card

White rounded surface containing the article.

### Read button

Strong action leading to the original BBC article.

### Practice box

Light background container separating individual exercises.

### Vocabulary chip

Small bordered rounded element.

### History item

Clickable article entry in the sidebar.

## 6. Responsive behavior

At widths below approximately 750px:

- sidebar becomes normal flow content
- main margin is removed
- article padding is reduced
- title size decreases
- article metadata stacks vertically

## 7. Interaction principles

The application should not introduce unnecessary animations.

Clickable items should have obvious hover/active states.

External BBC links should open in a new tab.

## 8. Accessibility

Future improvements should include:

- visible keyboard focus states
- semantic landmarks
- sufficient contrast
- accessible labels where icons are introduced
- keyboard navigation for article history
