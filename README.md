# LendWell

LendWell is a React and Vite prototype for a consent-led lending journey. It includes borrower-facing flows, lender dashboards, underwriting views, observability screens, and a guided demo overlay.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React icons

## Project Structure

```text
.
├── src/
│   ├── components/      # Reusable UI and layout components
│   ├── context/         # App and demo state providers
│   ├── data/            # Prototype data fixtures
│   ├── demo/            # Guided demo overlay and navigation helpers
│   ├── hooks/           # Shared React hooks
│   └── screens/         # Borrower and lender screen flows
├── docs/                # Product, problem, solution, and presentation docs
├── archive/             # Historical/reference material
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Routes

- `/borrower/home`
- `/borrower/trust`
- `/borrower/discovery`
- `/borrower/fetch`
- `/borrower/success`
- `/lender/dashboard`
- `/lender/observability`
- `/lender/underwriting`

## Notes

Generated folders such as `node_modules/` and `dist/` are intentionally ignored for GitHub. They can be recreated with `npm install` and `npm run build`.
