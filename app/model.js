const db = require("../db/connection");

exports.selectTopics = () => {
    return db
    .query("SELECT slug, description FROM topics")
    .then(({rows}) => {
      return rows
    })
}