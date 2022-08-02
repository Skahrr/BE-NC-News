const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  test("serves an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toEqual(true);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("return the requested article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("should respond with 400 error when passed an invalid id(NaN)", () => {
    return request(app)
      .get("/api/articles/uno")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("should respond with 404 error when passed a valid id but doesnt exist on db", () => {
    return request(app)
      .get("/api/articles/123123")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});

describe("PATCH /api/articles/article_id", () => {
  test("status 200: should increment the votes of an article and return the updated version", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(5);
      });
  });
  test("status 200: should decrement the votes of an article and return the updated version", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(50);
      });
  });
  test("status 404: id not found", () => {
    return request(app)
      .patch("/api/articles/123123")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("status 400: bad request invalid ID", () => {
    return request(app)
      .patch("/api/articles/paco")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("status 400: negative votes", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: -5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Article can not have negative votes");
      });
  });
  test("status 400: bad request inc_votes missing", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({inc_vovovotes: 5})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing inc_votes or wrong key");
      });
  });
  test("status 400: bad request inc_votes invalid input", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({inc_votes : 'mystery'})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Input must be a number");
      });
  });
});

describe('GET /api/users', ()=>{
  test("serves an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toEqual(true);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
})
