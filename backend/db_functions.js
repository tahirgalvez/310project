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
     * Delete a media from the title table given its t_const.
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
     * Advanced Search. Use only relevant parameters, the rest can be set to null.
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
     * @returns {string} string - SQL query command to search for media in the title table.
     */
    searchTitle(title=null, titleType=null, isAdult=null, minYear=null, maxYear=null, minRunTimeMinutes=null, maxRunTimeMinutes=null, minRating=null, maxRating=null, genres=null, page=1, itemsPerPage=50) {

        if (title == null) {
            title = ''
        }

        var query = `
SELECT title.t_const, title.title_type, title.primary_title, title.original_title, title.is_adult, title.start_year, title.end_year, title.runtime_minutes, title.genres, rating.average_rating, rating.num_votes 
FROM title LEFT JOIN rating on title.t_const = rating.t_const
    WHERE (title.primary_title LIKE \'%${title}%\' OR title.original_title LIKE \'%${title}%\') `;

        if (titleType != null) {
            query += `AND ('${titleType}' = title.title_type) `;
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
                    query += `AND ('${genre}' = ANY(title.genres)) `;
                });
            }
            else {
                query += `AND ('${genres}' = ANY(title.genres)) `;
            }
        }

        query += `
LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};`;

        console.log(query);
        return query;
    }

    /**
     * Retrieve episodes from a specific media
     * @param {string} tconst string - Primary key to the title table.
     * @returns {string} string - SQL query command to search for all episodes of a tv show.
     */
    getEpisodes(tconst) {
        var query = `
SELECT * FROM episode
    WHERE (episode.parent_t_const = '${tconst}');`;

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
     * @param {number} deathYear number - In YYYY formate if applicable.
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
    primaryProfessions = '{ ${primaryProfessions} }',
    knownForTitles = '{ ${knownForTitles} }'`;

        console.log(query);
        return query;
    }
}

module.exports = dbf;