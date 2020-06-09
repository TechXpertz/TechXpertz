CREATE DATABASE techxpertz_database;

create extension if not exists "uuid-ossp";

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    oauth_id VARCHAR(255) UNIQUE NOT NULL
);  