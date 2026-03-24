-- ══════════════════════════════════════════════════════════════════
--  קופון פלוס — Supabase Setup
--  הרץ קובץ זה ב: Supabase Dashboard → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS coupons (
  id           TEXT PRIMARY KEY,          -- coup_01, coup_02...
  name         TEXT NOT NULL DEFAULT '',
  chain        TEXT NOT NULL DEFAULT '',
  category     TEXT         DEFAULT '',
  discount     TEXT         DEFAULT '',
  type         TEXT         DEFAULT 'קוד קופון',
  code         TEXT         DEFAULT '',
  url          TEXT         DEFAULT '',
  expiry       TEXT         DEFAULT '',   -- dd/mm/yyyy
  badge        TEXT         DEFAULT '',   -- חם / חדש / מוגבל / פסח / שבועות...
  image        TEXT         DEFAULT '',
  description  TEXT         DEFAULT '',
  pdf          TEXT         DEFAULT '',
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON coupons;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Public can read active coupons
CREATE POLICY "public_read" ON coupons
  FOR SELECT USING (is_active = true);

-- Service role has full access (admin panel)
CREATE POLICY "service_all" ON coupons
  FOR ALL USING (auth.role() = 'service_role');

-- ── View for admin panel (all coupons, including inactive) ────────
CREATE OR REPLACE VIEW coupons_admin AS
  SELECT * FROM coupons ORDER BY created_at DESC;

-- ══════════════════════════════════════════════════════════════════
--  טבלת סליידר
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS slides (
  id          SERIAL       PRIMARY KEY,
  title       TEXT         NOT NULL DEFAULT '',
  subtitle    TEXT         DEFAULT '',
  tag         TEXT         DEFAULT '',
  discount    TEXT         DEFAULT '',
  type        TEXT         DEFAULT 'קישור להטבה',
  code        TEXT         DEFAULT '',
  url         TEXT         DEFAULT '',
  image       TEXT         DEFAULT '',
  coupon_id   TEXT         DEFAULT '',
  is_active   BOOLEAN      DEFAULT true,
  sort_order  INT          DEFAULT 0,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "slides_public_read" ON slides FOR SELECT USING (is_active = true);
CREATE POLICY "slides_service_all" ON slides FOR ALL USING (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════
--  טבלת הודעות טיקר
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS announcements (
  id           SERIAL       PRIMARY KEY,
  text         TEXT         NOT NULL DEFAULT '',
  url          TEXT         DEFAULT '',
  is_clickable BOOLEAN      DEFAULT false,
  is_active    BOOLEAN      DEFAULT true,
  sort_order   INT          DEFAULT 0,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ann_public_read" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "ann_service_all" ON announcements FOR ALL USING (auth.role() = 'service_role');
