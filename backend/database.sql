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
INSERT INTO topics (topic_name) VALUES ('Data Structures and Algorithms');
INSERT INTO topics (topic_name) VALUES ('Frontend');
INSERT INTO topics (topic_name) VALUES ('Backend');
INSERT INTO topics (topic_name) VALUES ('System Design');
INSERT INTO topics (topic_name) VALUES ('Applied Data Science');

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

CREATE TABLE IF NOT EXISTS expert_backgrounds(
    user_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    company TEXT NOT NULL,
    company_role TEXT NOT NULL,
    working_exp INTEGER NOT NULL CHECK (working_exp BETWEEN 0 AND 10)
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

CREATE TABLE IF NOT EXISTS questions(
    question_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    topic_id INTEGER REFERENCES topics(topic_id) NOT NULL,
    content TEXT NOT NULL,
    solution TEXT NOT NULL,
    hint TEXT NOT NULL
);

-- prepoulating questions table
\COPY questions (title, topic_id, content, solution, hint) FROM 'questions.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS past_interviews(
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE PRIMARY KEY,
    question_id INTEGER REFERENCES questions(question_id) NOT NULL
);

CREATE TABLE IF NOT EXISTS feedbacks(
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE PRIMARY KEY,
    correctness_rating INTEGER NOT NULL CHECK (correctness_rating BETWEEN 1 AND 10),
    correctness_feedback TEXT,
    clarity_rating INTEGER NOT NULL CHECK (clarity_rating BETWEEN 1 AND 10),
    clarity_feedback TEXT,
    behavioural_rating INTEGER NOT NULL CHECK (behavioural_rating BETWEEN 1 AND 10),
    behavioural_feedback TEXT,
    others TEXT
);

CREATE TABLE IF NOT EXISTS comments(
    comment_id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE NOT NULL,
    comment TEXT NOT NULL,
    date_col DATE NOT NULL,
    time_stamp TIME NOT NULL
);