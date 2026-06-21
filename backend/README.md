# Al Arish Travel — Backend API

Express + MongoDB API powering the public site forms and the admin portal.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit .env with your real MongoDB URI
npm run dev
```

The server listens on `http://localhost:5000` by default.

On first boot it will:

1. Connect to the MongoDB URI from `MONGODB_URI`.
2. Create the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if none exists.
3. Seed the four default packages and the site settings singleton.

## Environment variables

| Variable          | Purpose                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| `PORT`            | API port (default `5000`)                                                |
| `MONGODB_URI`     | MongoDB connection string                                                |
| `JWT_SECRET`      | Secret used to sign admin JWTs                                           |
| `JWT_EXPIRES_IN`  | Token lifetime, e.g. `7d`                                                |
| `CORS_ORIGIN`     | Comma-separated allowed origins (e.g. `http://localhost:5173`)           |
| `ADMIN_EMAIL`     | Email for the seeded admin account                                       |
| `ADMIN_PASSWORD`  | Password for the seeded admin account                                    |

## Endpoints (overview)

Public:

- `POST /api/auth/login`
- `GET  /api/packages/public`
- `GET  /api/settings/public`
- `POST /api/submissions/quote`
- `POST /api/submissions/contact`
- `POST /api/submissions/hajj`

Admin (require `Authorization: Bearer <token>`):

- `GET    /api/auth/me`
- `POST   /api/auth/change-password`
- `GET    /api/packages`
- `POST   /api/packages`
- `PUT    /api/packages/:id`
- `PATCH  /api/packages/:id/visibility`
- `PATCH  /api/packages/:id/featured`
- `DELETE /api/packages/:id`
- `GET    /api/submissions`
- `GET    /api/submissions/summary`
- `GET    /api/submissions/recent?after=ISO_DATE`
- `PATCH  /api/submissions/:id/status`
- `PATCH  /api/submissions/:id/read`
- `PATCH  /api/submissions/:id/notes`
- `POST   /api/submissions/mark-all-read`
- `DELETE /api/submissions/:id`
- `GET    /api/settings`
- `PUT    /api/settings`
