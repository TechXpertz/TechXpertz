CREATE DATABASE techxpertz_database;

create extension if not exists "uuid-ossp";

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- CREATE TABLE local_users(
--     local_id uuid REFERENCES users(user_id),
--     username VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL
-- );

CREATE TABLE google_users(
    user_id uuid REFERENCES users(user_id),
    google_id VARCHAR(255) NOT NULL UNIQUE
)