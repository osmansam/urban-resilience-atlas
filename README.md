# Urban Resilience Atlas

Urban Resilience Atlas is a single-page React application that connects a seven-paragraph narrative to a twenty-city data table. Readers can move from a value in the text to its source cell and from a table cell back to every matching mention.

The city names and values are original synthetic coursework data. They illustrate interaction and comparison patterns and should not be treated as real measurements.

## Assignment coverage

The shipped content exceeds the Project 1 minimums:

| Requirement                 |            Included |
| --------------------------- | ------------------: |
| Narrative length            |         1,116 words |
| Narrative paragraphs        |                   7 |
| Table size                  | 20 rows × 7 columns |
| Interactive text mentions   |                  42 |
| Distinct linked table cells |                  40 |

The page supports pointer, keyboard, and touch interaction. Hovering or focusing previews a relationship. Selecting a text mention pins the matching table cell and moves focus to it. Selecting an underlined table value moves to its first matching mention and highlights every occurrence. Escape and the **Clear selection** button reset the view. Cells without narrative references remain plain table values.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm 10 or newer

The Node.js range matches the installed Vite version's declared engine requirement.

## Install and run

Open a terminal in this project folder and install the locked dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Vite prints a local address, normally `http://localhost:5173`. Open that address in a browser.

## Verify

Run the code-quality checks:

```bash
npm test
npm run lint
```

Create a type-checked production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Production deployment

`npm run build` creates a static site in `dist/`. Deploy the contents of that directory to any static host.

- **Netlify:** choose this repository, use `npm run build` as the build command, and set the publish directory to `dist`.
- **Cloudflare Pages:** use `npm run build` as the build command and `dist` as the output directory.
- **GitHub Pages or another subpath:** set Vite's `base` option in `vite.config.ts` to the repository path before building.
- **Existing web server:** copy everything inside `dist/` to the site's public directory.

No backend service, API key, database, or runtime environment variable is required.

## Project structure

```text
src/
├── components/       Page sections and interactive text/table views
├── data/             Typed city records, columns, and narrative segments
├── domain/           Content metrics, validation, and link indexing
├── hooks/            Shared pinned and transient selection state
├── App.tsx            Page composition and bidirectional navigation
├── index.css          Plain page, table, link, and selection styles
└── main.tsx           React entry point
```

Content is separate from rendering and behavior. A narrative link stores a stable cell ID such as `pinehaven:canopy`, so repeated numbers in different rows cannot produce an ambiguous match.

## Accessibility

- Semantic headings, regions, captioned data table, and scoped headers
- Visible keyboard focus and non-color selection indicators
- Status announcements through an `aria-live` region
- Keyboard activation for every linked mention and table value
- Escape-to-clear behavior and a visible clear control
- Reduced-motion handling for scroll navigation
- Responsive stacked layout and horizontally scrollable table on narrow screens

## Technology and acknowledgments

The application uses [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vite.dev/). The project does not copy an external example or use an external dataset.

## Submission files

- Complete source code in this folder
- `docs/Urban_Resilience_Atlas_Design_Document.docx`

Before submitting, replace the group-member placeholders in the Word document and remove unused rows so the final submission lists every member accurately.
# urban-resilience-atlas
