# VeriTrust

**Every Document. Every Rule. Verified.**

VeriTrust is a light-mode regulatory compliance and document verification workspace prototype for AICTE institutional approval review.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
npm run preview
```

## Prototype areas

- Overview dashboard with portfolio metrics, processing status and attention items
- Application queue with search, filters, sorting and reviewer assignment
- Application review workspace with document checklist, preview panel, evidence-linked findings, notes and reviewer decisions
- Document repository with PDF/image upload interaction
- Verification centre with a staged seven-step workflow simulation
- Configurable compliance rule library
- CSV report export and report preview
- Chronological audit trail

## Important prototype boundaries

This is a **frontend-only demonstration**. OCR extraction, anomaly detection and verification results are simulated with sample data. Uploaded files and reviewer changes are stored in the current browser using local storage; files are not sent to a server. There is no live AI model, OCR engine, AICTE integration, authentication service, backend database or production-grade immutable audit service.

Automated findings are decision-support indicators only. They are not proof of fraud or a substitute for human regulatory review.

## Technology

React, Vite, JavaScript, Tailwind CSS, React Router, Lucide React and Recharts.
