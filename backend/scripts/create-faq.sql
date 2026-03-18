-- Run this SQL in the Supabase SQL editor to create the FAQ table
-- before running seed-faq.js

CREATE TABLE IF NOT EXISTS faq (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question    TEXT        NOT NULL,
  answer      TEXT        NOT NULL,
  mots_cles   TEXT[]      NOT NULL DEFAULT '{}',
  categorie   VARCHAR(50) NOT NULL DEFAULT 'general',
  ordre       INTEGER     NOT NULL DEFAULT 0,
  actif       BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast keyword search
CREATE INDEX IF NOT EXISTS idx_faq_mots_cles ON faq USING GIN (mots_cles);
CREATE INDEX IF NOT EXISTS idx_faq_categorie ON faq (categorie);
