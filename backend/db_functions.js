const { query } = require("express");

console.log("db_functions.js loading");

/**
 * Creates a single string from an array suitable for usage with SQL queries.
 * @param {string[]} array - An array of Strings.
 * @returns string - A single string containing elements of the array comma seperated.
 */
function arrayToString(array) {
    var string = "";
    if (Array.isArray(array)) {
        for (let i = 0; i < array.length; i++) {
            if (i != array.length - 1) {
                string += `"${array[i]}", `;
            }
            else {
                string += `"${array[i]}"`;
            }
        }
    }
    else {
        string += array;
    }

    return string;
}

const dbf = class DBFunctions{
    // Title Queries
    // Basic CRUD for titles
    /**
     * Inserts a media into the title table.
     * @param {string} tconst string - Primary key to the title table.
     * @param {string} titleType string - The type/format of the title (e.g. movie, short, tvseries, tvepisode, video, etc).
     * @param {string} primaryTitle string - The more popular title / the title used by the filmmakers on promotional materials at the point of release.
     * @param {string} originalTitle string - Original title, in the original language.
     * @param {boolean} isAdult boolean - True for adult titles, false otherwise.
     * @param {number} startYear number - Represents the release year of a title. In the case of TV Series, it is the series start year.
     * @param {number} endYear number - TV Series end year. Null for all other title types.
     * @param {number} runTimeMinutes number - Primary runtime of the title, in minutes.
     * @param {string[]} genres string[] - Includes up to three genres associated with the title.
     * @returns {string} string - SQL query command to insert a media to the title table.
     */
    insertTitle(tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runTimeMinutes, genres) {
        var query = `
INSERT INTO title(t_const, title_type, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes, genres)
    VALUES ('${tconst}', '${titleType}', '${primaryTitle}', '${originalTitle}', '${isAdult}', '${startYear}', '${endYear}', ${runTimeMinutes}, '{ ${arrayToString(genres)} }')`;
        
        console.log(query);
        return query;
    }

    /**
     * Gets a media from the title table.
     * @param {string} tconst 
     * @returns {string} string - SQL query command to get a title.
     */
    getTitle(tconst) {
        var query = `
SELECT * FROM title 
    WHERE (title.t_const = '${tconst}'');`;

        console.log(query);
        return query;
    }

    /**
     * Update a media from the title table.
     * @param {string} tconst string - Primary key to the title table.
     * @param {string} titleType string - The type/format of the title (e.g. movie, short, tvseries, tvepisode, video, etc).
     * @param {string} primaryTitle string - The more popular title / the title used by the filmmakers on promotional materials at the point of release.
     * @param {string} originalTitle string - Original title, in the original language.
     * @param {boolean} isAdult boolean - True for adult titles, false otherwise.
     * @param {number} startYear number - Represents the release year of a title. In the case of TV Series, it is the series start year.
     * @param {number} endYear number - TV Series end year. Null for all other title types.
     * @param {number} runTimeMinutes number - Primary runtime of the title, in minutes.
     * @param {string[]} genres string[] - Includes up to three genres associated with the title.
     * @returns {string} string - SQL query command to update the title table.
     */
    updateTitle(tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runTimeMinutes, genres) {
        var query = `
UPDATE title
SET t_const = '${tconst}',
    title_type = '${titleType}',
    primary_title = '${primaryTitle}',
    original_title = '${originalTitle}',
    is_adult = ${isAdult},
    start_year = ${startYear},
    end_year = ${endYear},
    runtime_minutes = ${runTimeMinutes},
    genres = '{ ${arrayToString(genres)} }'
WHERE title.t_const = '${tconst}';`;

        console.log(query);
        return query;
    }

    /**
     * Delete a media from the title table given its t_const. The title table is
     * depended on by many other tables (rating, person, title_directors, title_writers,
     * title_cast, and episode). Deleting an entry from the title table will also delete
     * entries from other tables.
     * @param {string} tconst string - Primary key to the title table.
     * @returns {string} string - SQL query command to delete a media from the title table.
     */
    deleteTitle(tconst) {
        var query = `
DELETE FROM title
    WHERE title.t_const = '${tconst}';`;

        console.log(query);
        return query;
    }

    // Advanced Search
    /**
     * Advanced Search for titles. Use only relevant parameters, the rest should be set to null.
     * @param {string} title string - Title of the media.
     * @param {string} titleType string|string[] - Types of media. Uses AND for all types.
     * @param {boolean} isAdult boolean - If the media is for adults. null represents both.
     * @param {number} minYear number - Minimum year aired / release of the media.
     * @param {number} maxYear number - Max year aired / release of the media.
     * @param {number} minRunTimeMinutes number - Minimum run time minutes of the media.
     * @param {number} maxRunTimeMinutes number - Max run time minutes of the media.
     * @param {number} minRating number - Minimum rating (inclusive).
     * @param {number} maxRating number - Max rating (inclusive).
     * @param {string|string[]} genres string|string[] - Genres of the media. Uses AND for all types.
     * @param {number} page number - Page of UI to display. Assumes pages starts at 1.
     * @param {number} itemsPerPage number - Amount of items per page.
     * @param {string|string[]} orderBy string|string[] - Columns in title to order by. (title.t_const, title.title_type, title.primary_title, title.original_title, title.is_adult, title.start_year, title.end_year, title.runtime_minutes, title.genres, rating.average_rating, and/or rating.num_votes)
     * @param {boolean} ascending boolean - If orderBy was specified, choose for it to be ascending or descending.
     * @returns {string} string - SQL query command to search for media in the title table.
     */
    advancedSearchTitle(title=null, titleType=null, isAdult=null, minYear=null, maxYear=null, minRunTimeMinutes=null, maxRunTimeMinutes=null, minRating=null, maxRating=null, genres=null, page=1, itemsPerPage=50, orderBy=null, ascending=true) {

        if (title == null) {
            title = ''
        }

        var query = `
SELECT title.t_const, title.title_type, title.primary_title, title.original_title, title.is_adult, title.start_year, title.end_year, title.runtime_minutes, title.genres, rating.average_rating, rating.num_votes 
FROM title LEFT JOIN rating on title.t_const = rating.t_const
    WHERE (title.primary_title ILIKE '%${title}%' OR title.original_title ILIKE '%${title}%') `;

        if (titleType != null) {
            query += `AND ('${titleType}' ILIKE title.title_type) `;
        }

        if (isAdult != null) {
            if (isAdult) {
                query += `AND (title.is_adult IS true) `;
            }
            else {
                query += `AND (title.is_adult IS false) `;
            }
        }

        if (minYear != null && maxYear != null) {
            query += `AND (title.start_year >= ${minYear} AND title.start_year <= ${maxYear}) `
        }
        else if (minYear != null) {
            query += `AND (title.start_year >= ${minYear}) `
        }
        else if (maxYear != null) {
            query += `AND (title.start_year <= ${maxYear}) `
        }

        if (minRunTimeMinutes != null && maxRunTimeMinutes != null) {
            query += `AND (title.runtime_minutes >= ${minRunTimeMinutes} AND title.runtime_minutes <= ${maxRunTimeMinutes}) `
        }
        else if (minRunTimeMinutes != null) {
            query += `AND (title.runtime_minutes >= ${minRunTimeMinutes}) `
        }
        else if (maxRunTimeMinutes != null) {
            query += `AND (title.runtime_minutes <= ${maxRunTimeMinutes}) `
        }

        if (minRating != null && maxRating != null) {
            query += `AND (title.t_const = rating.t_const) AND (rating.average_rating >= ${minRating} AND rating.average_rating <= ${maxRating}) `
        }
        else if (minRating != null) {
            query += `AND (title.t_const = rating.t_const) AND (rating.average_rating >= ${minRating}) `
        }
        else if (maxRating != null) {
            query += `AND (title.t_const = rating.t_const) AND (rating.average_rating <= ${maxRating}) `
        }

        if (genres != null) {
            if (Array.isArray(genres)) {
                genres.forEach(genre => {
                    query += `AND ('${genre}' ILIKE ANY(title.genres)) `;
                });
            }
            else {
                query += `AND ('${genres}' ILIKE ANY(title.genres)) `;
            }
        }

        if (orderBy != null) {
            if (ascending) {
                query += `
ORDER BY ${arrayToString(orderBy)} ASC `;
            }
            else {
                query += `
ORDER BY ${arrayToString(orderBy)} DESC `;
            }
        }

        query += `
LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};`;

        console.log(query);
        return query;
    }

    // Episode Queries
    // Basic CRUD for episodes
    /**
     * Inserts an episode into the episode table.
     * @param {string} tconst string - Primary key to the episode table.
     * @param {string} parentTConst string - Foreign key referencing tconsts in the title table.
     * @param {number} seasonNumber number - The season this episode is associated with.
     * @param {number} episodeNumber number - The episode number of this season.
     * @returns {string} string - SQL query command to insert a episode into the episode table.
     */
    insertEpisode(tconst, parentTConst, seasonNumber, episodeNumber) {
        var query = `
INSERT INTO episode(t_const, parent_t_const, season_number, episode_number)
    VALUES('${tconst}', '${parentTConst}', ${seasonNumber}, ${episodeNumber});`;

        console.log(query);
        return query;
    }

    /**
     * Retrieve episodes from a specific media
     * @param {string} tconst string - Primary key to the title table.
     * @returns {string} string - SQL query command to search for all episodes of a tv show.
     */
    getEpisode(tconst) {
        var query = `
SELECT * FROM episode
    WHERE (episode.parent_t_const = '${tconst}');`;

        console.log(query);
        return query;
    }

    /**
     * Updates an episode from the episode table.
     * @param {string} tconst string - Primary key to the episode table.
     * @param {string} parentTConst string - Foreign key referencing tconsts in the title table.
     * @param {number} seasonNumber number - The season this episode is associated with.
     * @param {number} episodeNumber number - The episode number of this season.
     * @returns {string} string - SQL query command to update an episode from the episode table.
     */
    updateEpisode(tconst, parentTConst, seasonNumber, episodeNumber) {
        var query = `
UPDATE episode
SET t_const = '${tconst}',
    parent_t_const = '${parentTConst}',
    season_number = ${seasonNumber},
    episode_number = ${episodeNumber}
WHERE episode.t_const = '${tconst}';`;

        console.log(query);
        return query;
    }

    /**
     * Deletes and episode from the episode table.
     * @param {string} tconst string - Primary key to the episode table.
     * @returns string - SQL query command to delete an episode from the episode table.
     */
    deleteEpisode(tconst) {
        var query = `
DELETE FROM episode
    WHERE episode.t_const = '${tconst}';`;

        console.log(query);
        return query;
    }

    // Rating Queries
    // Basic CRUD for ratings
    /**
     * Inserts a rating for a media.
     * @param {string} tconst string - Foreign key referencing tconst from the title table.
     * @param {number} average_rating number - The media's average rating.
     * @param {number} num_votes number - The total number of votes associated with this title's rating.
     * @returns string - SQL query command to insert a rating into the rating table.
     */
    insertRating(tconst, average_rating, num_votes) {
        var query = `
INSERT INTO rating(t_const, average_rating, num_votes)
VALUES ('${tconst}', ${average_rating}, ${num_votes});`;

        console.log(query);
        return query;
    }

    /**
     * Gets a rating for a media.
     * @param {string} tconst string - Foreign key referencing tconst from the title table.
     * @returns string - SQL query command to get a rating from a media.
     */
    getRating(tconst) {
        var query = `
SELECT * FROM rating
    WHERE (rating.t_const = '${tconst}');`;

        console.log(query);
        return query;
    }
    
    /**
     * Updates a rating from the rating table.
     * @param {string} tconst string - Foreign key referencing tconst from the title table.
     * @param {number} average_rating number - The media's average rating.
     * @param {number} num_votes number - The total number of votes associated with this title's rating.
     * @returns string - SQL query command to update a rating from the rating table.
     */
    updateRating(tconst, average_rating, num_votes) {
        var query = `
UPDATE rating
SET t_const = '${tconst}',
    average_rating = ${average_rating},
    num_votes = ${num_votes}
WHERE (rating.t_const = '${tconst}');`;

        console.log(query);
        return query;
    }

    /**
     * Deletes a rating from the rating table.
     * @param {string} tconst string - Foreign key referencing tconst from the title table.
     * @returns string - SQL query command to delete a rating from the rating table.
     */
    deleteRating(tconst) {
        var query = `
DELETE FROM rating
    WHERE (rating.t_const = '${tconst}');`;

        console.log(query);
        return query;
    }

    // Person Queries
    // Basic CRUD for the person table
    /**
     * Inserts a person into the person table.
     * @param {string} nconst string - Primary key to the person table.
     * @param {string} primaryName string - Name by which the person is most often credited.
     * @param {number} birthYear number - In YYYY format.
     * @param {number} deathYear number - In YYYY format if applicable.
     * @param {string|string[]} primaryProfessions string|string[] - The top 3 professions of the person.
     * @param {string|string[]} knownForTitles string|string[] - (tconst) titles the person is known for.
     * @returns string - SQL query command to insert a person into the person table.
     */
    insertPerson(nconst, primaryName, birthYear, deathYear, primaryProfessions, knownForTitles) {
        var query = `
INSERT INTO person(n_const, primary_name, birth_year, death_year, primary_profession, known_for_titles)
    VALUES('${nconst}', '${primaryName}', ${birthYear}, ${deathYear}, '{ ${arrayToString(primaryProfessions)} }', '{ ${arrayToString(knownForTitles)} }');`;

        console.log(query);
        return query;
    }

    /**
     * Gets a person from the person table.
     * @param {string} nconst string - Primary key to the person table.
     * @returns string - SQL query command to get a person from the person table.
     */
    getPerson(nconst) {
        var query = `
SELECT * FROM person
    WHERE (person.n_const = '${nconst}'');`;

        console.log(query);
        return query;
    }

    /**
     * Update a person from the person table.
     * @param {string} nconst string - Primary key to the person table.
     * @param {string} primaryName string - Name by which the person is most often credited.
     * @param {number} birthYear number - In YYYY format.
     * @param {number} deathYear number - In YYYY formate if applicable.
     * @param {string|string[]} primaryProfessions string|string[] - The top 3 professions of the person.
     * @param {string|string[]} knownForTitles string|string[] - (tconst) titles the person is known for.
     * @returns string - SQL query command to update a person from the person table.
     */
    updatePerson(nconst, primaryName, birthYear, deathYear, primaryProfessions, knownForTitles) {
        var query = `
UPDATE person
SET n_const = '${nconst}',
    primary_name = '${primaryName}',
    birth_year = '${birthYear}',
    death_year = '${deathYear}',
    primary_profession = '{ ${primaryProfessions} }',
    known_for_titles = '{ ${knownForTitles} }'`;

        console.log(query);
        return query;
    }

    /**
     * Deletes a person from the person table. The person table is 
     * depended on by many other tables (title_directors, title_writers, and title_cast).
     * Deleting an entry from the person table will also delete entries from other tables.
     * @param {string} nconst string - Primary key to the person table.
     * @returns string - SQL query command to delete a person from the person table.
     */
    deletePerson(nconst) {
        var query = `
DELETE FROM person
    WHERE person.n_const = '${nconst}'`;

        console.log(query);
        return query;
    }

    /**
     * Advanced Search for person. Use only relevant parameters, the rest should be set to null.
     * @param {string} name string - Name by which the person is most often credited.
     * @param {number} minBirthYear number - In YYYY format. The minimum birth year to filter for.
     * @param {number} maxBirthYear number - In YYYY format. The maximum birth year to filter for.
     * @param {number} minDeathYear number - In YYYY format. The minimum death year to filter for.
     * @param {number} maxDeathYear number - In YYYY format. The maximum death year to filter for.
     * @param {string|string[]} professions string|string[] - Professions to filter for. This is an AND filter.
     * @param {number} page number - Page of UI to display. Assumes pages starts at 1.
     * @param {number} itemsPerPage number - Amount of items per page.
     * @param {string|string[]} orderBy string|string[] - Columns in title to order by. (person.n_const, person.primary_name, person.birth_year, person.death_year, person.primary_profession, and/or person.known_for_titles)
     * @param {boolean} ascending boolean - If orderBy was specified, choose for it to be ascending or descending.
     * @returns string - SQL query command to search for people in the person table.
     */
    advancedSearchPerson(name=null, minBirthYear=null, maxBirthYear=null, minDeathYear=null, maxDeathYear=null, professions=null, page=1, itemsPerPage=50, orderBy=null, ascending=true) {
        
        if (name == null) {
            name = '';
        }
        
        var query = `
SELECT person.n_const, person.primary_name, person.birth_year, person.death_year, person.primary_profession, person.known_for_titles
FROM person
    WHERE (person.primary_name ILIKE '%${name}%') `;

        if (minBirthYear != null && maxBirthYear != null) {
            query += `AND (person.birth_year >= ${minBirthYear} AND person.birth_year <= ${maxBirthYear}) `
        }
        else if (minBirthYear != null) {
            query += `AND (person.birth_year >= ${minBirthYear}) `
        }
        else if (maxBirthYear != null) {
            query += `AND (person.birth_year <= ${maxBirthYear}) `
        }

        if (minDeathYear != null && maxDeathYear != null) {
            query += `AND (person.death_year >= ${minDeathYear} AND person.death_year <= ${maxDeathYear}) `
        }
        else if (minDeathYear != null) {
            query += `AND (person.death_year >= ${minDeathYear}) `
        }
        else if (maxDeathYear != null) {
            query += `AND (person.death_year <= ${maxDeathYear}) `
        }

        if (professions != null) {
            if (Array.isArray(professions)) {
                professions.forEach(profession => {
                    query += `AND ('${profession}' ILIKE ANY(person.primary_profession)) `;
                });
            }
            else {
                query += `AND ('${professions}' ILIKE ANY(person.primary_profession)) `;
            }
        }

        if (orderBy != null) {
            if (ascending) {
                query += `
ORDER BY ${arrayToString(orderBy)} ASC `;
            }
            else {
                query += `
ORDER BY ${arrayToString(orderBy)} DESC `;
            }
        }

        query += `
LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};`;

        console.log(query);
        return query;
    }

    // Cast Queries
    // Basic CRUD for the title_cast table
    /**
     * Inserts a title and person into the title_cast relationship table.
     * @param {string} tconst string - Foreign key referencing a title in the title table.
     * @param {string} nconst string - Foreign key referencing a person in the person table.
     * @param {number} ordering number - A number to uniquely identify rows for a given titleId (this is the description given in the imdb dataset).
     * @param {string} category string - The category of job this person was in.
     * @param {string} job string - The specific job title if applicable.
     * @param {string} characters string - The name of the character played if applicable.
     * @returns {string} string - SQL query command to insert a title and person into the title_cast relationship table.
     */
    insertTitleCast(tconst, nconst, ordering, category, job, characters) {
        var query = `
INSERT INTO title_cast(t_const, n_const, ordering, category, job, characters)
    VALUES('${tconst}', '${nconst}', ${ordering}, '${category}', '${job}', '${characters}');`;

        console.log(query);
        return query;
    }

    /**
     * Gets the cast of a title from the title_cast table.
     * @param {string} tconst string - Foreign key referencing a title in the title table.
     * @returns {string} string - SQL query command to get the cast from the title_cast table based on a title's tconst.
     */
    getTitleCastWithTitle(tconst) {
        var query = `
SELECT * FROM title_cast
    WHERE (title_cast.t_const = '${tconst}');`;

        console.log(query);
        return query;
    }

    /**
     * Gets titles a person is associated with from the title_cast table.
     * @param {string} nconst string - Foreign key referencing a person in the person table.
     * @returns {string} string - SQL query command to get the titles from the title_cast table based on a person's nconst.
     */
    getTitleCastWithPerson(nconst) {
        var query = `
SELECT * FROM title_cast
    WHERE (title_cast.n_const = '${nconst}');`;

        console.log(query);
        return query;
    }

    /**
     * Updates a person from a title in the title_cast table.
     * @param {string} tconst string - Foreign key referencing a title in the title table.
     * @param {string} nconst string - Foreign key referencing a person in the person table.
     * @param {number} ordering number - A number to uniquely identify rows for a given titleId (this is the description given in the imdb dataset).
     * @param {string} category string - The category of job this person was in.
     * @param {string} job string - The specific job title if applicable.
     * @param {string} characters string - The name of the character played if applicable.
     * @returns {string} string - SQL query command to update a person from a title in the title_cast table.
     */
    updateTitleCast(tconst, nconst, ordering, category, job, characters) {
        var query = `
UPDATE title_cast
SET t_const = '${tconst}',
    n_const = '${nconst}',
    ordering = ${ordering},
    category = '${category}',
    job = '${job}',
    characters = '${characters}'
WHERE (title_cast.t_const = '${tconst}' AND title_cast.n_const = '${nconst}');`;

        console.log(query);
        return query;
    }

    /**
     * Deletes a title and cast relationship from the title_cast table.
     * @param {string} tconst string - Foreign key referencing a title in the title table.
     * @param {string} nconst string - Foreign key referencing a person in the person table.
     * @returns {string} string - SQL query command to delete a title and cast relationship from the title_cast table.
     */
    deleteTitleCast(tconst, nconst) {
        var query = `
DELETE FROM title_cast
    WHERE (title_cast.t_const = '${tconst}' AND title_cast.n_const = '${nconst}');`;

        console.log(query);
        return query;
    }


}

module.exports = dbf;
