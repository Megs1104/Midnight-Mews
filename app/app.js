
const express = require("express");

const app = express();
app.use(express.json());

const apiRouter = require("../routes/api-router");
app.use("/api", apiRouter);

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
    res.status(500).send({msg: "Internal Server Error"});
});

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Invalid Input"});
});

module.exports = app;