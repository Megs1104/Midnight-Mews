const db = require("../db/connection");

exports.selectTopics = () => {
    return db
    .query("SELECT slug, description FROM topics")
    .then(({rows}) => {
      return rows;
    });
}

exports.selectArticlesById = (articleId) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found"});
        }else{
            return rows[0];
        }
    });
}