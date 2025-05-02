const { selectTopics, 
    selectArticlesById, 
    selectArticles, 
    selectCommentsByArticle, 
    insertCommentsByArticle, 
    updateArticleVotes, 
    removeComment, 
    selectComments, 
    selectUsers, 
    selectUserByUsername,
    updateCommentVotes, 
    insertArticle } = require("./model"); 
const endpointsJson = require("../endpoints.json");

exports.getApi = (req, res) => {
    res.status(200).send({endpoints: endpointsJson} );
};

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((topics) => {
         res.status(200).send({ topics }); 
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
    const articleId = req.params.article_id;
    if (isNaN(articleId)){
        res.status(400).send({msg: "Bad Request"});
    }else{
        return selectArticlesById(articleId)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    });
    };
};

exports.getArticles = (req, res, next) => {
    const {sort_by, order, topic, limit, p} = req.query;
    return selectArticles(sort_by || "created_at", order || "desc", topic, Number(limit) || 10, Number(p) || 1)
    .then((articles, total_count) => {
        res.status(200).send({ articles, total_count });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getCommentsByArticle = (req, res, next) => {
    const articleId = req.params.article_id;
    const {limit, p} = req.query;
    if (isNaN(articleId)){
        res.status(400).send({msg: "Bad Request"});
    }else{
        return selectCommentsByArticle(articleId, limit || 10 , p || 1)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
    };
};

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
};

exports.patchArticleVotes = (req, res, next) => {
    const articleId = req.params.article_id;
    const { inc_votes } = req.body;
    if (isNaN(articleId) || typeof inc_votes !== "number"){
        res.status(400).send({msg: "Bad Request"});

    }else if (inc_votes === 0){
        res.status(400).send({msg: "Cannot Update Votes By 0"});

    }else {
        return updateArticleVotes(articleId, inc_votes)
        .then((updatedArticle) => {
         res.status(200).send({ updatedArticle });
        })
        .catch((err) => {
        next(err);
        });
    };
};

exports.deleteComment = (req, res, next) => {
    const commentId = req.params.comment_id;
    if(isNaN(commentId)){
        res.status(400).send({msg: "Bad Request"});   
    }else{
        return removeComment(commentId)
        .then(() => {
            res.status(204).end();
        })
        .catch((err) => {
            next(err);
        });
    };
};

exports.getComments = (req, res, next) => {
    return selectComments()
    .then((comments) => {
         res.status(200).send({ comments }); 
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
    const username = req.params.username;
    return selectUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch((err) => {
            next(err);
        }); 
};

exports.patchCommentVotes = (req, res, next) => {
    const commentId = req.params.comment_id;
    const { inc_votes } = req.body;
    if (isNaN(commentId) || typeof inc_votes !== "number"){
        res.status(400).send({msg: "Bad Request"});
    }else if (inc_votes === 0){
        res.status(400).send({msg: "Cannot Update Votes By 0"});
    }else {
        return updateCommentVotes(commentId, inc_votes)
        .then((updatedComment) => {
            res.status(200).send({ updatedComment });
        })
        .catch((err) => {
            next(err);
        });
    };
};

exports.postArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body;
    return insertArticle(author, title, body, topic, article_img_url)
        .then((newArticle) => {
            res.status(201).send({ newArticle })
        })
        .catch((err) => {
            next(err);
        });
};