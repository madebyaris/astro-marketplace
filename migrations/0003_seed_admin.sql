-- 0003_seed_admin.sql
-- Seed an initial admin user. Password hash is a placeholder for local/dev.
-- Replace with a securely hashed password during real auth implementation.

INSERT OR IGNORE INTO users (email, password_hash, is_admin)
VALUES (
  'arissetia.m@gmail.com',
  '$2b$12$2qHq3i7K9zVf1K8kWbD2huUqk8A1tB2Qnq7H9dK8f5b1a7X8pYbSe', -- bcrypt-style placeholder for SuksesSelalu1234
  1
);


