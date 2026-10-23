-- Safe, additive PostgreSQL migration for existing RawStock installations.
-- Existing supply_requests rows are preserved; historical actual delivery dates remain NULL.
ALTER TABLE IF EXISTS supply_requests
    ADD COLUMN IF NOT EXISTS actual_delivery_date DATE;
