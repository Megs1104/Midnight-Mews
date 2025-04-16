const db = require("../connection")
const {
  convertTimestampToDate, formattedTopicsData, formattedUsersData, createReferenceObject
} = require("../seeds/utils");
const format = require("pg-format")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles`)
  }).then(() => {
    return db.query(`DROP TABLE IF EXISTS users`)
  }).then(() => {
    return db.query(`DROP TABLE IF EXISTS topics`)
  }).then(() => {
    return db.query(`CREATE TABLE topics (
      slug VARCHAR(20) PRIMARY KEY NOT NULL UNIQUE, 
      description VARCHAR(100) NOT NULL, 
      img_url VARCHAR(1000)
      )`)
  }).then(() => {
    return db.query(`CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      avatar_url VARCHAR(1000))`)
  }).then(() => {
    return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
      title VARCHAR(100),
      topic VARCHAR(100) REFERENCES topics(slug),
      author VARCHAR(100) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000))`)
  }).then(() => {
    return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
      article_id INT REFERENCES articles(article_id),
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR(100) REFERENCES users(username),
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP)`)
  }).then(() => {
    const formattedTopics = formattedTopicsData(topicData);
    const topicsQuery = format(`INSERT INTO topics (
      slug, description, img_url)
      VALUES %L;`, formattedTopics);
      return db.query(topicsQuery);
  }).then(() => {
    const formattedUsers = formattedUsersData(userData);
    const usersQuery = format(`INSERT INTO users (
      username, name, avatar_url)
      VALUES %L`, formattedUsers);
      return db.query(usersQuery);
  }).then(() => {
    const formattedArticles = articleData.map((article) => {
      const articlesDataWithCorrectDate = convertTimestampToDate(article);
      return [
        articlesDataWithCorrectDate.title,
        articlesDataWithCorrectDate.topic,
        articlesDataWithCorrectDate.author,
        articlesDataWithCorrectDate.body,
        articlesDataWithCorrectDate.created_at,
        articlesDataWithCorrectDate.votes,
        articlesDataWithCorrectDate.article_img_url
      ];
    })
      const articlesQuery = format(`INSERT INTO articles (
      title, topic, author, body, created_at, votes, article_img_url) 
      VALUES %L`, formattedArticles);
      return db.query(articlesQuery + `RETURNING article_id, title`);
  }).then((result) => {
    const articlesReferenceObject = createReferenceObject(result.rows);
    const formattedComments = commentData.map((comment) => {
      const commentsDataWithCorrectDate = convertTimestampToDate(comment);
      return[
        articlesReferenceObject[comment.article_title],
        commentsDataWithCorrectDate.body,
        commentsDataWithCorrectDate.votes,
        commentsDataWithCorrectDate.author,
        commentsDataWithCorrectDate.created_at
      ];
    })
    const commentsQuery = format(`INSERT INTO comments (
      article_id, body, votes, author, created_at)
      VALUES %L`, formattedComments);

      return db.query(commentsQuery);
  })
};
module.exports = seed;
