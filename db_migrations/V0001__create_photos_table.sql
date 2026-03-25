CREATE TABLE IF NOT EXISTS t_p67328840_family_card_game_app.photos (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  s3_key TEXT NOT NULL,
  cdn_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);