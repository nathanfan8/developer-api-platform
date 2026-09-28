import { pool } from './db';

export async function initDatabase() {
  const query = `
    CREATE TABLE IF NOT EXISTS api_metrics (
      id BIGSERIAL PRIMARY KEY,
      method VARCHAR(10) NOT NULL,
      route VARCHAR(255) NOT NULL,
      status_code INT NOT NULL,
      duration_ms NUMERIC(10, 2) NOT NULL,
      ip_address VARCHAR(45),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_metrics_created_at ON api_metrics(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_metrics_route ON api_metrics(route);
  `;

  try {
    await pool.query(query);
    console.log('Database initialized: api_metrics table ready.');
  } catch (err) {
    console.error('Failed to initialize database table:', err);
    process.exit(1);
  }
}