const articlesRouter = require("express").Router();

const { 
    getArticlesById, 
    getArticles, 
    getCommentsByArticle, 
    postCommentByArticle, 
    patchArticleVotes,
    postArticle 
 } = require("../app/controller");

articlesRouter
.route("/")
.get(getArticles)
.post(postArticle);

articlesRouter
.route("/:article_id")
.get(getArticlesById)
.patch(patchArticleVotes);

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticle)
.post(postCommentByArticle);

module.exports = articlesRouter;