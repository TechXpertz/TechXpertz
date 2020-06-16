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
    topic_name VARCHAR(255) UNIQUE NOT NULL
);

-- prepoulating prog_languages table
INSERT INTO prog_languages (prog_name) VALUES ('Java');
INSERT INTO prog_languages (prog_name) VALUES ('JavaScript');
INSERT INTO prog_languages (prog_name) VALUES ('C++');
INSERT INTO prog_languages (prog_name) VALUES ('Python');

-- prepopulating topics table
INSERT INTO topics (topic_name) VALUES ('topic 1');
INSERT INTO topics (topic_name) VALUES ('topic 2');
INSERT INTO topics (topic_name) VALUES ('topic 3');
INSERT INTO topics (topic_name) VALUES ('topic 4');
INSERT INTO topics (topic_name) VALUES ('topic 5');

CREATE TABLE IF NOT EXISTS user_topics(
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES topics(topic_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS user_prog_languages(
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    prog_id INTEGER REFERENCES prog_languages(prog_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, prog_id)
);

CREATE TABLE IF NOT EXISTS normal_backgrounds(
    user_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    education VARCHAR(255) NOT NULL,
    has_experience BOOLEAN NOT NULL,
    interview_level INTEGER NOT NULL CHECK(interview_level BETWEEN 0 AND 5)
);

CREATE TABLE IF NOT EXISTS bookings(
    booking_id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    topic_id INTEGER REFERENCES topics(topic_id) NOT NULL,
    other_is_expert BOOLEAN NOT NULL,
    other_booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS booking_prog_languages(
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE,
    prog_id INTEGER REFERENCES prog_languages(prog_id) NOT NULL,
    PRIMARY KEY(booking_id, prog_id)
);

CREATE TABLE IF NOT EXISTS timeslots(
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE,
    date_col DATE NOT NULL,
    time_start TIME NOT NULL,
    PRIMARY KEY(booking_id, date_col, time_start)
);