process.env.NODE_ENV = 'test';
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const app = require("../app/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
require("jest-sorted");


beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topic objects", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: {topics}}) => {
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBe(3);
      topics.forEach((topic) => {
        expect(typeof topic).toBe("object");
      });
    });
  });
  test("200: Each topic object should have a slug property and a description property", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: {topics}}) => {
      expect(topics.length).toBe(3);
      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        });
      });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Returns a single article object by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
  test("200: Returned article should have author, title, article_id, body, topic, created_at, votes and article_img_url properties", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body: { article } }) => {
      expect(article).toMatchObject({
        "article_id": 1,
        "title": "Living in the shadow of a great man",
        "topic": "mitch",
        "author": "butter_bridge",
        "body": "I find this existence challenging",
        "created_at": expect.any(String),
        "votes": 100,
        "article_img_url":
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      });
    });
  });
});

describe("GET /api/articles", () => {
  test("200: Returns an array of article objects", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles:{articles, total_count}}}) => {
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);
      expect(total_count).toBe(13);
      articles.forEach((article) => {
        expect(typeof article).toBe("object");
      });
    });
  });
  test("200: Returns an array of article objects that are sorted in descending order by date", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles:{articles, total_count}}}) => {
      expect(articles).toBeSortedBy("created_at", {descending: true});
    });
  });
  test("200: Each article object returned should have the article_id, title, topic, author, created_at, votes, article_img_url and comment_count properties", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles:{articles, total_count}}}) => {
      expect(articles.length).toBeGreaterThan(0);
      articles.forEach((article) => {
        expect(article).toMatchObject({
          "article_id": expect.any(Number),
          "title": expect.any(String),
          "topic": expect.any(String),
          "author": expect.any(String),
          "created_at": expect.any(String),
          "votes": expect.any(Number),
          "article_img_url": expect.any(String),
          "comment_count": expect.any(String)
        });
      });
    });
  });
  test("200: The property comment_count should be accurately counted", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles:{articles, total_count}}}) => {
      expect(articles[0].comment_count).toBe("2");
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Returns with an array of all comments for a specified article", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body: {comments}}) => {
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBeGreaterThan(0);
      comments.forEach((comment) => {
        expect(typeof comment).toBe("object");
    });
  });
});
  test("200: Each comment should have a comment_id, article_id, body, votes, author and created_at property", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body: {comments}}) => {
      expect(comments.length).toBeGreaterThan(0);
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          "comment_id": expect.any(Number),
          "article_id": 1,
          "body": expect.any(String),
          "votes": expect.any(Number),
          "author": expect.any(String),
          "created_at": expect.any(String)
        });
      });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Returns the newly added comment as an object", () => {
    const commentToAdd = {username: "butter_bridge", body: "Good article!"};
    return request(app)
    .post("/api/articles/1/comments")
    .send(commentToAdd)
    .expect(201)
    .then(({body: {newComment}}) => {
      expect(typeof newComment).toBe("object");
    });
  });
  test("201: Returns the username and body properties of the added comment", () => {
    const commentToAdd = {username: "butter_bridge", body: "Good article!"};
    return request(app)
    .post("/api/articles/1/comments")
    .send(commentToAdd)
    .expect(201)
    .then(({body: {newComment}}) => {
      expect(newComment).toMatchObject({
        "username": "butter_bridge", 
        "body": "Good article!"
      });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Returns an object containing the updated article", () => {
    const votesToUpdate = { inc_votes: 1};
    return request(app)
    .patch("/api/articles/1")
    .send(votesToUpdate)
    .expect(200)
    .then(({body: {updatedArticle}}) => {
      expect(typeof updatedArticle).toBe("object");
    });
  });
  test("200: Returns the article with an updated votes property when it is increased", () => {
    const votesToUpdate = { inc_votes: 1};
    return request(app)
    .patch("/api/articles/1")
    .send(votesToUpdate)
    .expect(200)
    .then(({body: {updatedArticle}}) => {
      expect(updatedArticle.votes).toBe(101);
    });
  });
  test("200: Returns the article with an updated votes property when it is decreased", () => {
    const votesToUpdate = { inc_votes: -1};
    return request(app)
    .patch("/api/articles/1")
    .send(votesToUpdate)
    .expect(200)
    .then(({body: {updatedArticle}}) => {
      expect(updatedArticle.votes).toBe(99);
    });
  });
  test("200: The updated article should have the properties author, title, article_id, body, topic, created_at, votes and article_img_url properties", () => {
    const votesToUpdate = { inc_votes: 1};
    return request(app)
    .patch("/api/articles/1")
    .send(votesToUpdate)
    .expect(200)
    .then(({body: {updatedArticle}}) => {
      expect(updatedArticle).toMatchObject({
        "article_id": 1,
        "title": "Living in the shadow of a great man",
        "topic": "mitch",
        "author": "butter_bridge",
        "body": "I find this existence challenging",
        "created_at": expect.any(String),
        "votes": 101,
        "article_img_url":
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with 204 after successful deletion and 404 when try to get the comment after deletion", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(() => {
      return request(app)
      .get("/api/comments/1")
      .expect(404);
    });
   });
   test("204: Responds with 204 after successful deletion of only specified comment and 200 when all other comments can be retrieved", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(() => {
      return request(app)
      .get("/api/comments")
      .expect(200)
      .then(({body: { comments}}) => {
        expect(comments.length).toBe(17);
      });
    });
   });
});

describe("GET /api/users", () => {
  test("200: Returns an array of all user objects", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body: {users}}) => {
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(4);
      users.forEach((user) => {
        expect(typeof user).toBe("object");
      });
    });
  });
  test("200: Returns an array of all user objects which contain a username, name and avatar_url property", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body: {users}}) => {
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(4);
      users.forEach((user) => {
        expect(user).toMatchObject({
          "username": expect.any(String),
          "name": expect.any(String),
          "avatar_url": expect.any(String)
        });
      });
    });
  });
});

describe("GET /api/articles (sorting queries)", () => {
test("200: Returns articles sorted by article_id with default order of descending", () => {
  return request(app)
  .get("/api/articles?sort_by=article_id&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
  expect(articles).toBeSortedBy("article_id", {descending: true});
  });
});
test("200: Returns articles sorted by title with default order of descending", () => {
  return request(app)
  .get("/api/articles?sort_by=title&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
  expect(articles).toBeSortedBy("title", {descending: true});
  });
});
test("200: Returns articles sorted by topic with default order of descending", () => {
  return request(app)
  .get("/api/articles?sort_by=topic&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
  expect(articles).toBeSortedBy("topic", {descending: true});
  });
});
test("200: Returns articles sorted by author with default order of descending", () => {
  return request(app)
  .get("/api/articles?sort_by=author&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
  expect(articles).toBeSortedBy("author", {descending: true});
  });
});
test("200: Returns articles sorted by created_at with default order of descending", () => {
  return request(app)
  .get("/api/articles?sort_by=created_at&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
  expect(articles).toBeSortedBy("created_at", {descending: true});
  });
});
test("200: Returns articles sorted by votes with default order of descending", () => {
  return request(app)
  .get("/api/articles?sort_by=votes&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
  expect(articles).toBeSortedBy("votes", {descending: true});
  });
});
test("200: Returns articles sorted by article_img_url with default order of descending", () => {
  return request(app)
  .get("/api/articles?sort_by=article_img_url&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
  expect(articles).toBeSortedBy("article_img_url", {descending: true});
  });
});
test("200: Returns articles sorted in ascending order", () => {
  return request(app)
  .get("/api/articles?sort_by=article_id&order=asc&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
  expect(articles).toBeSortedBy("article_id", {descending: false});
  });
});
});

describe("GET /api/articles (topic query)", () => {
test('200: Returns articles that have the specified topic value', () => {
  return request(app)
  .get("/api/articles?topic=cats&limit=10&p=1")
  .expect(200)
  .then(({body: {articles:{articles, total_count}}}) => {
    expect(articles.length).toBe(1);
    articles.forEach((article) => {
      expect(article.topic).toBe("cats");
    });
  });
});
});

describe("GET /api/articles/:article_id (comment_count", () => {
  test('200: Returns single article which has a comment_count property', () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body: {article} }) => {
      expect(article.comment_count).toBe("11");
    });
  });
  test('200: Returns single article which has a comment_count property of 0 when given article has no comments', () => {
    return request(app)
    .get("/api/articles/11")
    .expect(200)
    .then(({ body: {article} }) => {
      expect(article.comment_count).toBe("0");
    });
  });
});

describe("GET /api/users/:username", () => {
test('200: Returns a single user object', () => {
  return request(app)
  .get("/api/users/butter_bridge")
  .expect(200)
  .then(({body: {user}}) => {
    expect(typeof user).toBe("object");
  });
});
test('200: Returns a single user object with the username, avatar_url and name properties', () => {
  return request(app)
  .get("/api/users/butter_bridge")
  .expect(200)
  .then(({body: {user}}) => {
    expect(user).toMatchObject({
      username: "butter_bridge",
      name: "jonny",
      avatar_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"})
  });
});
});

describe("PATCH /api/comments/:comment_id", () => {
  test('200: Returns an object containing the updated comment', () => {
    const votesToUpdate = { inc_votes: 1};
    return request(app)
    .patch("/api/comments/1")
    .send(votesToUpdate)
    .expect(200)
    .then(({body: {updatedComment}}) => {
      expect(typeof updatedComment).toBe("object");
    });
  });
  test('200: Returns the comment with an updated votes property when it is increased', () => {
    const votesToUpdate = { inc_votes: 1};
    return request(app)
    .patch("/api/comments/1")
    .send(votesToUpdate)
    .expect(200)
    .then(({body: {updatedComment}}) => {
      expect(updatedComment.votes).toBe(17)
    });
  });
  test('200: Returns the comment with an updated votes property when it is decreased', () => {
    const votesToUpdate = { inc_votes: -1};
    return request(app)
    .patch("/api/comments/1")
    .send(votesToUpdate)
    .expect(200)
    .then(({body: {updatedComment}}) => {
      expect(updatedComment.votes).toBe(15)
    });
  });
  test('200: The updated comment should have the  comment_id, article_id, body, votes, author and created_at properties', () => {
    const votesToUpdate = {inc_votes: 1};
    return request(app)
    .patch("/api/comments/1")
    .send(votesToUpdate)
    .expect(200)
    .then(({body: {updatedComment}})=> {
      expect(updatedComment).toMatchObject({
        "comment_id": 1,
        "article_id": 9,
        "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        "votes": 17,
        "author": "butter_bridge",
        "created_at": expect.any(String)
      });
    });
  });
});

describe("POST /api/articles", () => {
  test('201: Returns an object containing the newly added article', () => {
    const articleToAdd = {
      "author": "butter_bridge",
      "title": "Why cats are the best.",
      "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
      "topic": "cats",
      "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
    };
    return request(app)
    .post("/api/articles")
    .send(articleToAdd)
    .expect(201)
    .then(({body: {newArticle}}) => {
      expect(typeof newArticle).toBe("object");
    });
  });
  test('201: Returned article has the article_id, author, title, body, topic, article_img_url, votes, created_at and comment_count properties', () => {
    const articleToAdd = {
      "author": "butter_bridge",
      "title": "Why cats are the best.",
      "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
      "topic": "cats",
      "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
    };
    return request(app)
    .post("/api/articles")
    .send(articleToAdd)
    .expect(201)
    .then(({body: {newArticle}}) => {
      expect(newArticle).toMatchObject({
        "article_id": 14,
        "title": "Why cats are the best.",
        "topic": "cats",
        "author": "butter_bridge",
        "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
        "created_at": expect.any(String),
        "votes": 0,
        "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1",
        "comment_count": "0"
      });
    });
  });
});

describe("GET /api/articles (pagination)", () => {
  test('200: Returns articles when limit and offset are specified', () => {
    return request(app)
    .get("/api/articles?limit=20&p=1")
    .expect(200)
    .then(({body: {articles:{articles, total_count}}}) => {
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(13);
      expect(total_count).toBe(13);
      articles.forEach((article) => {
        expect(typeof article).toBe("object");
      });
    });
  });
  test('200: When limit and offset are specified but incorreclty, should set them to defaults and return articles ', () => {
    return request(app)
    .get("/api/articles?limit=incorrect&p=incorrect")
    .expect(200)
    .then(({body: {articles:{articles, total_count}}}) => {
      expect(articles.length).toBe(10);
      expect(total_count).toBe(13);
      articles.forEach((article) => {
        expect(typeof article).toBe("object");
      });
    });
  });
  test('200: Returns correct total_count property which includes total of all articles', () => {
    return request(app)
    .get("/api/articles?limit=10&p=1")
    .expect(200)
    .then(({body: {articles:{articles, total_count}}}) => {
      expect(total_count).toBe(13);
    });
  });
});

describe("GET /api/artciles/:article_id/comments (pagination", () => {
  test('200: Returns comments when limit and offset are specified', () => {
    return request(app)
    .get("/api/articles/1/comments?limit=10&p=1")
    .expect(200)
    .then(({body: {comments}}) => {
     expect(comments.length).toBe(10);
     expect(Array.isArray(comments)).toBe(true)
     comments.forEach((comment) => {
      expect(typeof comment).toBe("object");
    });
    });
  });
  test('200: When limit and offset are specified but incorreclty, should set them to defaults and return comments ', () => {
    return request(app)
    .get("/api/articles/1/comments?limit=incorrect&p=incorrect")
    .expect(200)
    .then(({body: {comments}}) => {
      expect(comments.length).toBe(10);
      expect(Array.isArray(comments)).toBe(true)
      comments.forEach((comment) => {
        expect(typeof comment).toBe("object");
      });
    });
  });
})

describe('POST /api/topics', () => {
  test('201: Returns an object containing the newly added topic', () => {
    const topicToAdd = {
      "slug": "topic name here",
      "description": "description here"
    };
    return request(app)
    .post("/api/topics")
    .send(topicToAdd)
    .expect(201)
    .then(({body: {newTopic}}) => {
      expect(typeof newTopic).toBe("object");
    });
  });
  test('201: Returned topic has the slug and description properties', () => {
    const topicToAdd = {
      "slug": "topic name here",
      "description": "description here"
    };
    return request(app)
    .post("/api/topics")
    .send(topicToAdd)
    .expect(201)
    .then(({body: {newTopic}}) => {
      expect(newTopic).toMatchObject({
        "slug": "topic name here",
        "description": "description here"
      });
    });
  });
});

describe('DELETE /api/articles/:article_id', () => {
  test("204: Responds with 204 after successful deletion and 404 when try to get the article or related comments after deletion", () => {
    return request(app)
    .delete("/api/articles/1")
    .expect(204)
    .then(() => {
      return request(app)
      .get("/api/articles/1")
      .expect(404)
      .then(() => {
        return request(app)
        .get("/api/1/comments")
        .expect(404)
      })
    });
   });
   test("204: Responds with 204 after successful deletion of only specified article and 200 when all other articles can be retrieved", () => {
    return request(app)
    .delete("/api/articles/1")
    .expect(204)
    .then(() => {
      return request(app)
      .get("/api/articles?limit=20&p=1")
      .expect(200)
      .then(({body: { articles:{ articles } }}) => {
        expect(articles.length).toBe(12);
      });
    });
   });
   test("204: Responds with 204 after successful deletion of only specified article and 404 when comments for that article cannot be retrieved", () => {
    return request(app)
    .delete("/api/articles/1")
    .expect(204)
      .then(() => {
        return request(app)
        .get("/api/1/comments")
        .expect(404)
        .then(({body: { msg }}) => {
          expect(msg).toBe("Invalid Input")
        });
      });
   });
});

describe("Error handling", () => {
  describe("Error handling for general errors", () => {
    test("404: Returns 404 when endpoint is not found", () => {
      return request(app)
          .get("/api/notTopics")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid Input");
          });
    });
    });

  describe("Error handling for GET /api/articles/:article_id/comments", () => {
      test("400: Returns 400 when article_id is not a number", () => {
        return request(app)
        .get("/api/articles/notANumber/comments")
        .expect(400)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Bad Request");
        });
      });
      test("404: Returns 404 when article_id is valid but has no comments", () => {
        return request(app)
        .get("/api/articles/4/comments")
        .expect(404)
        .then(({body: {msg}}) => {
          expect(msg).toBe("No Comments Found");
        });
      });
      test("404: Returns 404 when article_id is invalid due to being out of scope", () => {
        return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Article Not Found");
        });
      });
    });

  describe("Error handling for GET /api/articles/:article_id", () => {
      test("400: Returns 400 when article_id is not a number", () => {
        return request(app)
        .get("/api/articles/notANumber")
        .expect(400)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Bad Request");
        });
      });
      test("404: Returns 404 when article_id is valid but does not contain any data", () => {
        return request(app)
        .get("/api/articles/15")
        .expect(404)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Article Not Found");
        });
      });
      test("404: Returns 404 when article_id is invalid due to being out of scope", () => {
        return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Article Not Found");
        });
      });
    });

  describe("Error handling for POST /api/articles/:article_id/comments", () => {
      test("404: Returns 404 when the user does not exist", () => {
        const commentToAdd = {username: "not_a_user", body: "Good article!"};
        return request(app)
        .post("/api/articles/1/comments")
        .send(commentToAdd)
        .expect(404)
        .then(({body: {msg}}) => {
          expect(msg).toBe("User Does Not Exist");
        });
      });
      test("404: Returns 404 when the article does not exist", () => {
        const commentToAdd = {username: "butter_bridge", body: "Good article!"};
        return request(app)
        .post("/api/articles/1000/comments")
        .send(commentToAdd)
        .expect(404)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Article Not Found");
        });
      });
      test("400: Returns 400 when article_id is not a number", () => {
        const commentToAdd = {username: "butter_bridge", body: "Good article!"};
        return request(app)
        .post("/api/articles/notANumber/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Bad Request");
        });
      });
      test("400: Returns 400 when the passed username is not of the correct data type", () => {
        const commentToAdd = {username: 1, body: "Good article!"};
        return request(app)
        .post("/api/articles/1/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Bad Request");
        });
      });
      test("400: Returns 400 when the passed body is not of the correct data type", () => {
        const commentToAdd = {username: "butter_bridge", body: 1};
        return request(app)
        .post("/api/articles/1/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Bad Request");
        });
      });
      test("400: Returns 400 when a vital property is missing from provided object", () => {
        const commentToAdd = {username: "butter_bridge"}
        return request(app)
        .post("/api/articles/1/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({body: {msg}}) => {
          expect(msg).toBe("Bad Request");
        });
      });
    });

  describe("Error handling for PATCH /api/articles/:article_id", () => {
    test("400: Responds 400 when article_id is not a number", () => {
      const votesToUpdate = { inc_votes: 1};
      return request(app)
      .patch("/api/articles/notANumber")
      .send(votesToUpdate)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("404: Returns 404 when the article does not exist", () => {
      const votesToUpdate = { inc_votes: 1};
      return request(app)
      .patch("/api/articles/1000/")
      .send(votesToUpdate)
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Article Not Found");
      });
    });
    test("400: Responds 400 when inc_votes is not a number", () => {
      const votesToUpdate = { inc_votes: "not a number"};
      return request(app)
      .patch("/api/articles/1")
      .send(votesToUpdate)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Responds 400 when inc_votes is 0", () => {
      const votesToUpdate = { inc_votes: 0};
      return request(app)
      .patch("/api/articles/1")
      .send(votesToUpdate)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Cannot Update Votes By 0");
      });
    });
  });

  describe("Error handling for DELETE /api/comments", () => {
    test("404: Returns 404 when comment_id is valid but does not contain any data", () => {
      return request(app)
      .delete("/api/comments/30")
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Comment Not Found");
      });
    });
    test("400: Returns 400 when comment_id is not a number", () => {
      return request(app)
      .delete("/api/comments/notANumber")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("404: Returns 404 when comment_id is not provided", () => {
      return request(app)
      .delete("/api/comments/")
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Invalid Input");
      });
    });
  });

  describe("Error handling for GET /api/articles?sort_by= ...", () => {
    test('400: Returns 400 when sort criteria is invalid', () => {
      return request(app)
      .get("/api/articles?sort_by=notValid")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test('400: Returns 400 when order criteria is invalid', () => {
      return request(app)
      .get("/api/articles?sort_by=title&order=notValid")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
  });

  describe("Error handling for GET /api/articles?topic= ...", () => {
    test('404: Returns 404 when topic does not exist ', () => {
      return request(app)
      .get("/api/articles?topic=notValid")
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Topic Not Found");
      });
    });
  });

  describe("Error handling for GET /api/users/:username", () => {
  test('404: Returns 404 when username is valid but does not exist', () => {
    return request(app)
    .get("/api/users/notAUSer")
    .expect(404)
    .then(({body: {msg}}) => {
      expect(msg).toBe("No User With That Username Found");
    });
  });
  });

  describe("Error handling for PATCH /api/comments/:comment_id", () => {
    test("400: Responds 400 when comment_id is not a number", () => {
      const votesToUpdate = { inc_votes: 1};
      return request(app)
      .patch("/api/comments/notANumber")
      .send(votesToUpdate)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("404: Returns 404 when the comment does not exist", () => {
      const votesToUpdate = { inc_votes: 1};
      return request(app)
      .patch("/api/comments/1000/")
      .send(votesToUpdate)
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Comment Not Found");
      });
    });
    test("400: Responds 400 when inc_votes is not a number", () => {
      const votesToUpdate = { inc_votes: "not a number"};
      return request(app)
      .patch("/api/comments/1")
      .send(votesToUpdate)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Responds 400 when inc_votes is 0", () => {
      const votesToUpdate = { inc_votes: 0};
      return request(app)
      .patch("/api/comments/1")
      .send(votesToUpdate)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Cannot Update Votes By 0");
      });
    });
  });

  describe("Error handling for POST /api/articles", () => {
    test("404: Returns 404 when the user does not exist", () => {
      const articleToAdd = {
        "author": "notAUser",
        "title": "Why cats are the best.",
        "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
        "topic": "cats",
        "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
      };
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("User Does Not Exist");
      });
    });
    test("404: Returns 404 when the topic does not exist", () => {
      const articleToAdd = {
        "author": "butter_bridge",
        "title": "Why cats are the best.",
        "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
        "topic": "notATOpic",
        "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
      };
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Topic Not Found");
      });
    });
    test("400: Returns 400 when the passed author is not of the correct data type", () => {
      const articleToAdd = {
        "author": 1,
        "title": "Why cats are the best.",
        "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
        "topic": "cats",
        "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
      };
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Returns 400 when the passed title is not of the correct data type", () => {
      const articleToAdd = {
        "author": "butter_bridge",
        "title": 1,
        "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
        "topic": "cats",
        "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
      };
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Returns 400 when the passed body is not of the correct data type", () => {
      const articleToAdd = {
        "author": "butter_bridge",
        "title": "Why cats are the best.",
        "body": 1,
        "topic": "cats",
        "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
      };
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Returns 400 when the passed topic is not of the correct data type", () => {
      const articleToAdd = {
        "author": "butter_bridge",
        "title": "Why cats are the best.",
        "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
        "topic": 1,
        "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
      };
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Returns 400 when the passed article_img_url is not of the correct data type", () => {
      const articleToAdd = {
        "author": "butter_bridge",
        "title": "Why cats are the best.",
        "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
        "topic": "cats",
        "article_img_url": 1
      };
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Returns 400 when a vital property is missing from provided object", () => {
      const articleToAdd = {
        "author": "butter_bridge",
        "title": "Why cats are the best.",
        "body": "Cats are the best because they are snuggly, fluffy, cute and sometimes cheeky.",
        "article_img_url": "https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?resize=1320%2C1320&ssl=1"
      };
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test('400: Returns 400 when article already exists', () => {
      const articleToAdd = {
        author: "butter_bridge",
        title: "Living in the shadow of a great man",
        body: "I find this existence challenging",
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
      return request(app)
      .post("/api/articles")
      .send(articleToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Article With That Title Already Exists");
      });
    });
  });

  describe("Error handling for POST /api/topics", () => {
    test("400: Returns 400 when the passed slug is not of the correct data type", () => {
      const topicToAdd = {
        "slug": 1,
        "description": "description here"
      };
      return request(app)
      .post("/api/topics")
      .send(topicToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Returns 400 when the passed description is not of the correct data type", () => {
      const topicToAdd = {
        "slug": "topic name here",
        "description": 1
      };
      return request(app)
      .post("/api/topics")
      .send(topicToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("400: Returns 400 when a vital property is missing from provided object", () => {
      const topicToAdd = {
        "slug": "topic name here",
      };
      return request(app)
      .post("/api/topics")
      .send(topicToAdd)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
  });

  describe("Error handling for DELETE /api/articles/:article_id", () => {
    test("404: Returns 404 when article_id is valid but does not contain any data", () => {
      return request(app)
      .delete("/api/articles/30")
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Article Not Found");
      });
    });
    test("400: Returns 400 when article_id is not a number", () => {
      return request(app)
      .delete("/api/articles/notANumber")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad Request");
      });
    });
    test("404: Returns 404 when article_id is not provided", () => {
      return request(app)
      .delete("/api/articles/")
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Invalid Input");
      });
    });
  });
});