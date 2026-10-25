CREATE TABLE IF NOT EXISTS alerts (
 id BIGSERIAL PRIMARY KEY, endpoint TEXT NOT NULL,
 severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
 anomaly_type TEXT NOT NULL, message TEXT NOT NULL,
 details JSONB NOT NULL DEFAULT '{}'::jsonb, ai_explanation TEXT,
 status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','resolved')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_alerts_status_created ON alerts(status, created_at DESC);
