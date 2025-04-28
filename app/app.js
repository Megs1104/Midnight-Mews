const { getApi, getTopics } = require("./controller");
const express = require("express");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }else{
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
})

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Invalid Input"})
    })

module.exports = app;