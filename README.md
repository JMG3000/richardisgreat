# RichardIsGreat

A Google-authenticated star-catching game made for Richard, with difficulty settings, score multipliers, persistent high scores, and a pseudonymous global leaderboard.

## Privacy model

Neon stores only a keyed account hash, the player-created username, game settings, and high score. Google email, display name, avatar, and provider identifiers are never written to the game database.

## Setup

1. Create a Neon database and run `db/schema.sql`.
2. Copy `.env.example` to `.env.local` and provide the five server-side values.
3. Configure one Google OAuth redirect URI: `/api/auth/callback/google` on the deployed origin.
4. Run `npm install && npm run dev`.
