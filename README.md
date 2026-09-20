# eclipse-portfolio

Personal portfolio site. Built with Next.js 15, Tailwind CSS, and Framer Motion.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Pages

- `/` — home
- `/about` — skills and background
- `/projects` — projects and staff history
- `/experience` — work experience
- `/contact` — contact links
- `/admin` — content manager (password protected)

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Content

All site content lives in `data/content.json`. You can edit it directly or use the admin panel at `/admin`.

Default admin password: `eclipse2024`

To change it, set the `ADMIN_PASSWORD` environment variable.

## Project structure

```
app/          # pages and API routes
components/   # navbar, footer, music player, animations
data/         # content.json (all site text/data)
lib/          # animation config, content reader
public/       # images, music
```

## Adding background music

Drop an MP3 into `public/music/background.mp3` and the player in the bottom-right corner will work automatically.

## Deploy

Works out of the box on [Vercel](https://vercel.com). Just connect the repo.
