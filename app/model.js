const db = require("../db/connection");


const checkArticleExists = (articleId) => {
  return db
  .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
  .then(({rows}) => {
    if(rows.length === 0){
      return Promise.reject({status: 404, msg: "Article Not Found"})
    }else{
      return true;
    }
  })
}

const checkUserExists = (username) => {
  return db
  .query("SELECT * FROM users WHERE username = $1", [username])
  .then(({rows}) => {
    if(rows.length === 0){
      return Promise.reject({status: 404, msg: "User Does Not Exist"})
    }else{
      return true;
    }
  })
}

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
            return Promise.reject({status: 404, msg: "Article Not Found"});
        }else{
            return rows[0];
        }
    });
}

exports.selectArticles = () => {
    return db
    .query(`
      SELECT 
        articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
      GROUP BY 
        articles.article_id
      ORDER BY articles.created_at DESC
    `)
    .then(({rows}) => {
        return rows;
    });
}

exports.selectCommentsByArticle = (articleId) => {
  return checkArticleExists(articleId)
  .then(() => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
    .then(({rows}) => {
      if (rows.length === 0){
        return Promise.reject({status: 404, msg: "No Comments Found"});
    }else{
        return rows;
    }
    });
  });
}

exports.insertCommentsByArticle = (articleId, username, body) => {
  if(typeof username !== "string"|| typeof body !== "string"){
    return Promise.reject({status: 400, msg: "Bad Request"});
  }
  return checkArticleExists(articleId)
  .then(() => {
    return checkUserExists(username)
    .then(() => {
      return db.query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING author AS username, body`, [articleId, username, body])
      .then(({rows}) => {
        return rows[0];
      });
    });
  });
}