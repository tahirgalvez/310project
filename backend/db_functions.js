console.log("db_functions.js loading");

const dbf = class DBFunctions{
    // Title Queries
    getAllTitles() {
        return "SELECT * FROM title";
    }

    // Basic CRUD for titles
    insertTitle(tconst, titletype, primarytitle, originaltitle, isadult, startyear, endyear, runtimeminutes, genres) {
        var query = `
INSERT INTO title(t_const, title_type, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes, genres)
    VALUES ('${tconst}', '${titletype}', '${primarytitle}', '${originaltitle}', '${isadult}', '${startyear}', '${endyear}', ${runtimeminutes}, '{`;
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

    getTitle(tconst) {
        var query = `
SELECT * FROM title 
    WHERE (title.t_const = ${tconst});`;

        console.log(query);
        return query;
    }

    updateTitle(tconst, titletype, primarytitle, originaltitle, isadult, startyear, endyear, runtimeminutes, genres) {
        var query = `
UPDATE title
SET t_const = '${tconst}',
    title_type = '${titletype}',
    primary_title = '${primarytitle}',
    original_title = '${originaltitle}',
    is_adult = ${isadult},
    start_year = ${startyear},
    end_year = ${endyear},
    runtime_minutes = ${runtimeminutes},
    genres = '{`
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

    deleteTitle(tconst) {
        var query = `
DELETE FROM title
    WHERE title.t_const = '${tconst}';`;

        console.log(query);
        return query;
    }

    // Advanced Search
    searchTitle(title=null, genre=null, minRating=null, maxRating=null, page=1, itemsPerPage=50) {

        if (title == null) {
            title = ''
        }
        
        console.log(title + " " + genre + " " + minRating + " " + maxRating + " " + page + " " + itemsPerPage);


        var query = `
SELECT * FROM title, rating
    WHERE (title.primary_title LIKE \'%${title}%\' OR title.original_title LIKE \'%${title}%\') `;

        if (genre != null) {
            query += `AND ('${genre}' = ANY(title.genres) `;
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
        query += `)
LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};`;

        console.log(query);
        return query;
    }
}

module.exports = dbf;