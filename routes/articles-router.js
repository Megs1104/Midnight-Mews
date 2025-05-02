const articlesRouter = require("express").Router();

const { 
    getArticlesById, 
    getArticles, 
    getCommentsByArticle, 
    postCommentByArticle, 
    patchArticleVotes,
    postArticle, 
    deleteArticle
 } = require("../app/controller");

articlesRouter
.route("/")
.get(getArticles)
.post(postArticle);

articlesRouter
.route("/:article_id")
.get(getArticlesById)
.patch(patchArticleVotes)
.delete(deleteArticle);

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticle)
.post(postCommentByArticle);

module.exports = articlesRouter;