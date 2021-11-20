CREATE DATABASE csce310project;

CREATE TABLE title(
    tconst varchar(50) PRIMARY KEY,
    titleType varchar(50),
    primaryTitle varchar(50),
    originalTitle varchar(50),
    isAdult boolean,
    startYear integer,
    endYear integer,
    runtimeMinutes integer,
    genres varchar(50)[]
);