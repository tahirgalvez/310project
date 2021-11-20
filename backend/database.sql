-- Using postgresql
-- 

CREATE DATABASE csce310project;

CREATE TABLE title(
    t_const varchar(50) PRIMARY KEY,
    title_type varchar(50),
    primary_title varchar(50),
    original_title varchar(50),
    is_adult boolean,
    start_year integer,
    end_year integer,
    runtime_minutes integer,
    genres varchar(50)[]
);