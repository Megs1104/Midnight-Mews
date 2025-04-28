const { selectTopics } = require("./model"); 
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