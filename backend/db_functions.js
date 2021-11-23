console.log("db_functions.js loading");

const dbf = class DBFunctions{
    getAllTitles() {
        return "SELECT * FROM title";
    }

    insertTitle(tconst, titletype, primarytitle, originaltitle, isadult, startyear, endyear, runtimeminutes, genres) {
        var query = `
INSERT INTO title(t_const, title_type, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes, genres)
    VALUES ('` + tconst + `', '` + titletype + `', '` + primarytitle + `', '` + originaltitle + `', ` + isadult + `, ` + startyear + `, ` + endyear + `, ` + runtimeminutes + `, '{`;

        for (let i = 0; i < genres.length; i++) {
            if (i != genres.length - 1) {
                query += `"` + genres[i] + `", `;
            } else {
                query += `"` + genres[i] + `"}');`;
            }
        }

        console.log(query);
        return query;
    }

    getTitle(tconst) {
        var query = `
SELECT * FROM title 
    WHERE (title.t_const = ` + tconst + `);`;

        console.log(query);
        return query;
    }

    searchTitle(title) {
        var query = `
SELECT * FROM title 
    WHERE (title.primary_title LIKE \'%` + title + `%\' OR title.original_title LIKE \'%` + title + `%\');`;

        console.log(query);
        return query;
    }

    updateTitle(tconst, titletype, primarytitle, originaltitle, isadult, startyear, endyear, runtimeminutes, genres) {
        var query = `
UPDATE title
SET t_const = '` + tconst + `',
    title_type = '` + titletype + `',
    primary_title = '` + primarytitle + `',
    original_title = '` + originaltitle + `',
    is_adult = ` + isadult + `,
    start_year = ` + startyear + `,
    end_year = ` + endyear + `,
    runtime_minutes = ` + runtimeminutes + `,
    genres = '{`
        for (let i = 0; i < genres.length; i++) {
            if (i != genres.length - 1) {
                query += `"` + genres[i] + `", `;
            } else {
                query += `"` + genres[i] + `"}'`;
            }
        }
        query += `
WHERE title.t_const = '` + tconst +`';`;

        console.log(query);
        return query;
    }

    deleteTitle(tconst) {
        var query = `
DELETE FROM title
    WHERE title.t_const = '` + tconst + `';`;

        console.log(query);
        return query;
    }
}

module.exports = dbf;