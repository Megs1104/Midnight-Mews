const { getApi, getTopics, 
    getArticlesById, 
    getArticles, 
    getCommentsByArticle, 
    postCommentByArticle, 
    patchArticleVotes, 
    deleteComment,
    getComments, 
    getUsers
 } = require("./controller");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", postCommentByArticle);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/comments", getComments);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }else{
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "Bad Request"});
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
});

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Invalid Input"})
});

module.exports = app;