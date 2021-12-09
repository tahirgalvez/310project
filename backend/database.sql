-- Using postgresql
-- Run these commands in order to initialize the database!

CREATE DATABASE csce310project;

CREATE TABLE title(
    t_const varchar(50) PRIMARY KEY,
    title_type varchar(50),
    primary_title varchar(200),
    original_title varchar(200),
    is_adult boolean,
    start_year integer,
    end_year integer,
    runtime_minutes integer,
    genres varchar(50)[]
);

CREATE TABLE rating(
    t_const varchar(50) REFERENCES title(t_const) ON DELETE CASCADE,
    average_rating decimal,
    num_votes integer
);

CREATE TABLE person(
    n_const varchar(50) PRIMARY KEY,
    primary_name varchar(200),
    birth_year integer,
    death_year integer,
    primary_profession varchar(200)[],
    known_for_titles varchar(200)[]
);

CREATE TABLE title_cast(
    t_const varchar(50) REFERENCES title(t_const) ON DELETE CASCADE,
    n_const varchar(50) REFERENCES person(n_const) ON DELETE CASCADE,
    ordering integer,
    category varchar(200),
    job varchar(200),
    characters varchar(200)
);

CREATE TABLE episode(
    t_const varchar(50) PRIMARY KEY,
    parent_t_const varchar(50) REFERENCES title(t_const) ON DELETE CASCADE,
    season_number integer,
    episode_number integer
);
