This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Docker

Quick instructions to build and run the app with MySQL using Docker Compose:

1. Build and start services:

```bash
docker-compose up --build
```

2. The app will be available at http://localhost:3000. The Compose file creates a MySQL database with the following defaults:

- user: `discord_user`
- password: `discord_pass`
- database: `discord`

If you change credentials, update `DATABASE_URL` in `docker-compose.yml` or pass a custom env file.

Notes:
- The container runs `npx prisma migrate deploy` on startup (with retries) to apply migrations.
- If you want to run only the app image build:

```bash
docker build -t discord-app .
```
