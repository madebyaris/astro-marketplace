-- 0003_seed_admin.sql
-- Seed an initial admin user. Password hash is a placeholder for local/dev.
-- Replace with a securely hashed password during real auth implementation.

INSERT OR IGNORE INTO users (email, password_hash, is_admin)
VALUES (
  'arissetia.m@gmail.com',
  '$2a$10$X2nQb4tOnAj1gKNuRkBisuNZ5FtyltBCMeUXV3pT7Alns.2ALmHLy', -- bcrypt hash for Admin123!
  1
);


