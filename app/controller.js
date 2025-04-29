const { selectTopics, 
    selectArticlesById, 
    selectArticles, 
    selectCommentsByArticle, 
    insertCommentsByArticle, 
    updateArticleVotes, 
    removeComment, 
    selectComments, 
    selectUsers } = require("./model"); 
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

exports.postCommentByArticle = (req, res, next) => {
    const articleId = req.params.article_id;
    const { username, body } = req.body;
    return insertCommentsByArticle(articleId, username, body)
        .then((newComment) => {
            res.status(201).send({ newComment })
        })
        .catch((err) => {
            next(err);
        });
    
}

exports.patchArticleVotes = (req, res, next) => {
    const articleId = req.params.article_id;
    const { inc_votes } = req.body;
    if (isNaN(articleId) || typeof inc_votes !== "number"){
        res.status(400).send({msg: "Bad Request"});
    }else if (inc_votes === 0){
        res.status(400).send({msg: "Cannot Update Votes By 0"})
    }else{
    return updateArticleVotes(articleId, inc_votes)
    .then((updatedArticle) => {
         res.status(200).send({ updatedArticle })
    })
    .catch((err) => {
        next(err);
    });
    }
}

exports.deleteComment = (req, res, next) => {
    const commentId = req.params.comment_id;
    if(isNaN(commentId)){
        res.status(400).send({msg: "Bad Request"});   
    }else{
        return removeComment(commentId)
        .then(() => {
            res.status(204).end()
        })
        .catch((err) => {
            next(err);
        });
    }
}

exports.getComments = (req, res, next) => {
    return selectComments()
    .then((comments) => {
         res.status(200).send({ comments }); 
    })
    .catch((err) => {
        next(err);
    });
}

exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then((users) => {
        res.status(200).send({ users })
    })
    .catch((err) => {
        next(err);
    })

}