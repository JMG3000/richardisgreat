CREATE TABLE IF NOT EXISTS players (
  account_key text PRIMARY KEY,
  username varchar(18) NOT NULL,
  high_score integer NOT NULL DEFAULT 0 CHECK (high_score >= 0),
  speed_level smallint NOT NULL DEFAULT 4 CHECK (speed_level BETWEEN 0 AND 10),
  star_level smallint NOT NULL DEFAULT 1 CHECK (star_level BETWEEN 0 AND 10),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS players_username_unique_ci ON players (lower(username));
CREATE INDEX IF NOT EXISTS players_leaderboard ON players (high_score DESC, updated_at ASC);

COMMENT ON TABLE players IS 'Pseudonymous game records only. Do not store email, name, avatar, or provider identifiers.';
