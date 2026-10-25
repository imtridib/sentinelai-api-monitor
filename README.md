# SentinelAI — Intelligent API Monitoring & Alert System

SentinelAI is a full-stack demonstration that accepts API health measurements, detects anomalies using deterministic rules, optionally generates an AI explanation, stores alerts in PostgreSQL, and displays them in a React dashboard.

## Features

- `POST /monitor` — submit an endpoint measurement and create alerts for detected anomalies.
- `GET /alerts` — list alerts; supports `?status=active|resolved` and `?limit=50`.
- `PATCH /alerts/:id/resolve` — resolve an active alert.
- `GET /health` — report backend and database health.
- Optional Gemini-powered explanations with a fallback when no API key is configured.
- PostgreSQL persistence, request logging, anomaly unit tests, and a React/Vite dashboard.

> **Scope note:** this submission processes measurements sent to `/monitor`; it does not automatically poll arbitrary external APIs on a schedule.

## Project structure

```text
sentinelai-api-monitor/
├── db/schema.sql
├── data/sample-input.json
├── scripts/init-db.js
├── src/
│   ├── aiExplainer.js
│   ├── alertRepository.js
│   ├── anomalyEngine.js
│   ├── config.js
│   ├── db.js
│   └── server.js
├── test/anomalyEngine.test.js
├── frontend/                 # React + Vite dashboard
├── AI_Prompts.docx           # AI-use documentation for the task
├── AI_Prompts.md
├── .env.example
└── package.json
```

## Run locally

Requirements: Node.js 18+ (Node.js 20+ recommended), npm, and PostgreSQL.

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`. Keep real credentials and API keys in `.env` only.
3. Install backend dependencies and create the schema:

   ```bash
   npm install
   npm run db:init
   npm test
   npm start
   ```

4. In a second terminal, run the frontend:

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

5. Open the Vite URL (normally `http://localhost:5173`). The backend normally runs at `http://localhost:3000`.

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp` if needed.

## Environment variables

Backend (`.env`):

| Variable | Purpose |
|---|---|
| `PORT` | Server port; hosting providers normally set this automatically. |
| `DATABASE_URL` | PostgreSQL connection URL. |
| `DB_SSL` | Set to `true` when the hosted database requires SSL; otherwise `false`. |
| `GEMINI_API_KEY` | Optional Gemini API key. Leave empty to use fallback explanations. |
| `GEMINI_MODEL` | Gemini model name configured for the project. |
| `FRONTEND_ORIGIN` | Exact origin allowed by CORS, e.g. `http://localhost:5173`. |

Frontend (`frontend/.env`):

- `VITE_API_BASE_URL` — backend base URL, without a trailing slash. For local work, `http://localhost:3000` is used by default.

Never commit `.env` files or publish database credentials/API keys. Only the `.env.example` templates belong in Git.

## Example request

```bash
curl -X POST http://localhost:3000/monitor \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"/api/orders","statusCode":500,"responseTimeMs":6400,"recordCount":0,"dataValid":false}'
```

## Deployment outline

- **Database:** create a PostgreSQL database (for example, on Neon) and run `db/schema.sql` in its SQL editor.
- **Backend:** deploy the repository on Render using the repository root, build command `npm install`, start command `npm start`, and health-check path `/health`. Configure the backend environment variables in the hosting dashboard.
- **Frontend:** import the same repository into Vercel and set the project Root Directory to `frontend`. Set `VITE_API_BASE_URL` to the deployed backend URL, then deploy. Update backend `FRONTEND_ORIGIN` to the exact deployed frontend origin and redeploy the backend.

After deployment, verify `/health`, alert loading, submitting a measurement, displaying the explanation/fallback, and resolving an alert. Free hosting plans may sleep when idle.

## Tests

Run `npm test`. The anomaly engine unit tests are intended to run without a live database.

## Limitations / future improvements

This is an interview-task demonstration, not a secured production service. It currently accepts submitted measurements rather than polling arbitrary APIs automatically. Before production use, add authentication, rate limiting, pagination, stronger request validation, integration tests, and any required alert delivery channel.
