# Deployment checklist

## Before pushing to GitHub

- [ ] `.env` files containing real secrets are not tracked.
- [ ] `.env.example` and `frontend/.env.example` contain placeholders/local defaults only.
- [ ] `AI_Prompts.docx` and `AI_Prompts.md` are included for the interview task.
- [ ] `npm test` passes.

## PostgreSQL

1. Create a hosted PostgreSQL database (e.g. Neon).
2. Run `db/schema.sql` in the provider's SQL editor.
3. Copy the connection string into the backend host's `DATABASE_URL` environment variable. Do not paste it into GitHub or chat.
4. Set `DB_SSL=true` if required by the hosted database/provider configuration.

## Render backend

- Repository: this project repository
- Root directory: blank (repository root)
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`
- Environment variables: `DATABASE_URL`, `DB_SSL`, `GEMINI_API_KEY` (optional), `GEMINI_MODEL`, `FRONTEND_ORIGIN`

`PORT` is supplied by Render automatically. Set `FRONTEND_ORIGIN` after the Vercel frontend URL is known, then redeploy the backend.

## Vercel frontend

- Import the same repository.
- Root Directory: `frontend`
- Framework preset: Vite (auto-detected)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com`

Use the actual Render URL and do not add a trailing slash. Redeploy the frontend after changing its environment variable.

## Smoke test

- [ ] Backend `/health` returns `status: ok` and `database: connected`.
- [ ] Frontend loads without CORS/network errors.
- [ ] Alerts are fetched from the hosted backend.
- [ ] Submitting a sample measurement can create an alert.
- [ ] Alert explanation/fallback is visible.
- [ ] Resolve action updates the alert.
