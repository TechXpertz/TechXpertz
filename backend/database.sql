CREATE DATABASE techxpertz_database;

create extension if not exists "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth0_id VARCHAR(255) UNIQUE NOT NULL,
    is_expert BOOLEAN
);  

CREATE TABLE IF NOT EXISTS prog_languages(
    prog_id SERIAL PRIMARY KEY,
    prog_name VARCHAR(255) UNIQUE NOT NULL 
);

CREATE TABLE IF NOT EXISTS topics(
    topic_id SERIAL PRIMARY KEY,
    topic VARCHAR(255) UNIQUE NOT NULL
);

-- prepoulating prog_languages table
INSERT INTO prog_languages (prog_name) VALUES ('Java');
INSERT INTO prog_languages (prog_name) VALUES ('JavaScript');
INSERT INTO prog_languages (prog_name) VALUES ('C++');
INSERT INTO prog_languages (prog_name) VALUES ('Python');

-- prepopulating topics table
INSERT INTO topics (topic) VALUES ('topic 1');
INSERT INTO topics (topic) VALUES ('topic 2');
INSERT INTO topics (topic) VALUES ('topic 3');
INSERT INTO topics (topic) VALUES ('topic 4');
INSERT INTO topics (topic) VALUES ('topic 5');