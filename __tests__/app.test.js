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

  })
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
        "created_at": "2020-07-09T20:11:00.000Z",
        "votes": 100,
        "article_img_url":
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
    })
  });
});

describe("GET /api/articles", () => {
  test("200: Returns an array of article objects", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles}}) => {
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(13);
      articles.forEach((article) => {
        expect(typeof article).toBe("object");
      });
    });
  });
  test("200: Returns an array of article objects that are sorted in descending order by date", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles}}) => {
      expect(articles).toBeSortedBy("created_at", {descending: true});
    });
  });
  test("200: Each article object returned should have the article_id, title, topic, author, created_at, votes, article_img_url and comment_count properties", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles}}) => {
      expect(articles.length).toBe(13);
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
    .then(({body: {articles}}) => {
      expect(articles[0].comment_count).toBe("2")
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
      expect(comments.length).toBe(11);
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
      expect(comments.length).toBe(11);
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          "comment_id": expect.any(Number),
          "article_id": expect.any(Number),
          "body": expect.any(String),
          "votes": expect.any(Number),
          "author": expect.any(String),
          "created_at": expect.any(String),
        });
      });
    });
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Returns the newly added comment as an object", () => {
    const commentToAdd = {username: "butter_bridge", body: "Good article!"};
    return request(app)
    .post("/api/articles/1/comments")
    .send(commentToAdd)
    .expect(201)
    .then(({body: {newComment}}) => {
      expect(typeof newComment).toBe("object");
    })
  })
  test("201: Returns the username and body properties of the added comment", () => {
    const commentToAdd = {username: "butter_bridge", body: "Good article!"};
    return request(app)
    .post("/api/articles/1/comments")
    .send(commentToAdd)
    .expect(201)
    .then(({body: {newComment}}) => {
      console.log(newComment)
      expect(newComment).toMatchObject({
        "username": expect.any(String), 
        "body": expect.any(String)
      })
    })
  })
})

describe("Error handling ofr POST /api/articles/:article_id/comments", () => {
  test("400: Returns 404 when the user does not exist", () => {
    const commentToAdd = {username: "not_a_user", body: "Good article!"};
    return request(app)
    .post("/api/articles/1/comments")
    .send(commentToAdd)
    .expect(404)
    .then(({body: {msg}}) => {
      expect(msg).toBe("User Does Not Exist");
    });
  })
  test("404: Returns 404 when the article does not exist", () => {
    const commentToAdd = {username: "butter_bridge", body: "Good article!"};
    return request(app)
    .post("/api/articles/1000/comments")
    .send(commentToAdd)
    .expect(404)
    .then(({body: {msg}}) => {
      expect(msg).toBe("Article Not Found");
    });
  })
  test("400: Returns 400 when article_id is not a number", () => {
    const commentToAdd = {username: "butter_bridge", body: "Good article!"};
    return request(app)
    .post("/api/articles/notANumber/comments")
    .send(commentToAdd)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toBe("Bad Request");
    });
  })
  test("400: Returns 400 when the passed username is not of the correct data type", () => {
    const commentToAdd = {username: 1, body: "Good article!"};
    return request(app)
    .post("/api/articles/1/comments")
    .send(commentToAdd)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toBe("Bad Request");
    });
  })
  test("400: Returns 400 when the passed body is not of the correct data type", () => {
    const commentToAdd = {username: "butter_bridge", body: 1};
    return request(app)
    .post("/api/articles/1/comments")
    .send(commentToAdd)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toBe("Bad Request");
    });
  })
})

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
})

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
})

describe("Error handling for general errors", () => {
 test("404: Returns 404 when endpoint is not found", () => {
  return request(app)
      .get("/api/notTopics")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Input")
      });
 });
});
