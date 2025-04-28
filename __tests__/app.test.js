const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const app = require("../app/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { toString } = require("../db/data/test-data/articles");


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
      expect(msg).toBe("Not Found");
    });
  });
  test("404: Returns 404 when article_id is invalid due to being out of scope", () => {
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body: {msg}}) => {
      expect(msg).toBe("Not Found");
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

