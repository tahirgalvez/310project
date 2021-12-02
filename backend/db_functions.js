console.log("db_functions.js loading");

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
    VALUES ('${tconst}', '${titleType}', '${primaryTitle}', '${originalTitle}', '${isAdult}', '${startYear}', '${endYear}', ${runTimeMinutes}, '{`;
        for (let i = 0; i < genres.length; i++) {
            if (i != genres.length - 1) {
                query += `"${genres[i]}",`;
            } else {
                query += `"${genres[i]}"}');`;
            }
        }

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
    WHERE (title.t_const = ${tconst});`;

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
    genres = '{`;
        for (let i = 0; i < genres.length; i++) {
            if (i != genres.length - 1) {
                query += `"${genres[i]}", `;
            } else {
                query += `"${genres[i]}"}'`;
            }
        }
        query += `
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
     * @param {number} page number - Page of UI to display.
     * @param {number} itemsPerPage number - Amount of items per page.
     * @returns {string} string - SQL query command to search for media in the title table.
     */
    searchTitle(title=null, titleType=null, isAdult=null, minYear=null, maxYear=null, minRunTimeMinutes=null, maxRunTimeMinutes=null, minRating=null, maxRating=null, genres=null, page=1, itemsPerPage=50) {

        if (title == null) {
            title = ''
        }
        //console.log(title + " " + genre + " " + minRating + " " + maxRating + " " + page + " " + itemsPerPage);


        var query = `
SELECT * FROM title, rating
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
            query += `AND (title.runtime_minutes >= ${minYear} AND title.runtime_minutes <= ${maxYear}) `
        }
        else if (minRunTimeMinutes != null) {
            query += `AND (title.runtime_minutes >= ${minRunTimeMinutes}) `
        }
        else if (maxRunTimeMinutes != null) {
            query += `AND (title.runtime_minutes <= ${maxRunTimeMinutes}) `
        }

        if (minRating != null && maxRating != null) {
            query += `AND (title.t_const = rating.t_const) AND (rating.average_rating >= ${minRating} AND rating.average_rating <= ${maxRating})`
        }
        else if (minRating != null) {
            query += `AND (title.t_const = rating.t_const) AND (rating.average_rating >= ${minRating})`
        }
        else if (maxRating != null) {
            query += `AND (title.t_const = rating.t_const) AND (rating.average_rating <= ${maxRating})`
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

        query += `)
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
}

module.exports = dbf;