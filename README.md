# Expense Tracker

MERN expense tracker with a Vite React frontend and an Express/MongoDB backend.

## Local development

1. Copy `server/.env.example` to `server/.env`
2. Copy `client/.env.example` to `client/.env`
3. Install dependencies:
   - `npm run install:all`
4. Start backend:
   - `npm run dev:server`
5. Start frontend:
   - `npm run dev:client`

## Deploy on Vercel

- Create one Vercel project with root directory `client`
- Create another Vercel project with root directory `server`
- Set `VITE_API_URL` in the client project to your deployed backend URL plus `/api`
- Set `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URL` in the server project
