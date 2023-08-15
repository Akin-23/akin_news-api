const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const fs = require("fs/promises");
const endpointObj = require("/Users/peterakin-nibosun/northcoders/backend/be-nc-news/endpoints.json")

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toEqual(expect.any(Array));
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("/api", () => {
  test("GET:200 sends object describing all the available endpoints in API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointObj);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 sends an article object which corresponds to the specific article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("title", "Living in the shadow of a great man");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at", '2020-07-09T20:11:00.000Z');
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
  });

  test('GET:404 sends an appropriate error message when given a valid but non-existent id', () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("article does not exist");
      });
    });
    
  test('GET:400 sends an appropriate error message when given an invalid id', () => {
    return request(app)
      .get("/api/articles/scooby")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Invalid id");
      });
    
  })
  
  });


