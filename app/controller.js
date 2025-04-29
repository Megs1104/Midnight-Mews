const { selectTopics, selectArticlesById, selectArticles, selectCommentsByArticle } = require("./model"); 
const endpointsJson = require("../endpoints.json");

exports.getApi = (req, res) => {
    res.status(200).send({endpoints: endpointsJson} );
}

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((topics) => {
         res.status(200).send({topics: topics}); 
    })
    .catch((err) => {
        next(err);
    });
}

exports.getArticlesById = (req, res, next) => {
    const articleId = req.params.article_id
    if (isNaN(articleId)){
        res.status(400).send({msg: "Bad Request"});
    }else{
        return selectArticlesById(articleId)
    .then((article) => {
        res.status(200).send({article: article});
    })
    .catch((err) => {
        next(err);
    });
    }
}

exports.getArticles = (req, res, next) => {
    return selectArticles()
    .then((articles) => {
        res.status(200).send({articles: articles});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getCommentsByArticle = (req, res, next) => {
    const articleId = req.params.article_id
    if (isNaN(articleId)){
        res.status(400).send({msg: "Bad Request"});
    }else{
        return selectCommentsByArticle(articleId)
    .then((comments) => {
        res.status(200).send({comments:comments});
    })
    .catch((err) => {
        next(err);
    });
    }
}