const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const jest_sorted = require("jest-sorted");

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
      .send({ inc_vovovotes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing inc_votes or wrong key");
      });
  });
  test("status 400: bad request inc_votes invalid input", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "mystery" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Input must be a number");
      });
  });
});

describe("GET /api/users", () => {
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
});

describe("GET /api/articles", () => {
  test("should return an array with all the articles sorted by created_at DESC order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });

        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
describe("GET /api/articles/:article_id with comment_count", () => {
  test("should return the article with comment_count column added and it''s value", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe(11);
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

describe("GET /api/articles/:article_id/comments", () => {
  test("responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404: ID not found when passing an Valid ID but doesnt exist on db", () => {
    return request(app)
      .get("/api/articles/10000000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("status 400: Bad request when they try to search for an invalid ID", () => {
    return request(app)
      .get("/api/articles/paco/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("status 200: Id is correct but there is no comments to show", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, this article has no comments");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with the posted comment", () => {
    const comment = { username: "butter_bridge", body: "I am not Aaron" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(Array.isArray(comment)).toBe(true);
        expect.objectContaining({
          votes: expect.any(Number),
          article_id: expect.any(Number),
          author: expect.any(String),
          body: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("status 404: ID not found", () => {
    const comment = { username: "butter_bridge", body: "I am not Aaron" };
    return request(app)
      .post("/api/articles/12312323/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("status 400: invalid ID", () => {
    const comment = { username: "butter_bridge", body: "I am not Aaron" };
    return request(app)
      .post("/api/articles/paco/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("status 400: bad request wrong properties/values", () => {
    const comment = { nameuser: "butter_bridge", dybo: "I am not Aaron" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing data/Wrong datatype");
      });
  });
});

describe("ADD QUERIES FOR GET /api/articles", () => {
  test("should return the articles sorted by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("should return the articles ordered in asc way", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("should return the articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("should return the articles formatted according to the specified queries", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC&topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: false });
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "cats",
            })
          );
        });
      });
  });
  test("status 400: invalid query inputs (sort_by non existent column)", () => {
    return request(app)
      .get("/api/articles?sort_by=paco")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("status 400: invalid query inputs (order input wrong)", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=diagonal&topic=cats")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("status 200: valid topic but no article", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("0 matches found");
      });
  });
  test("status 404: non existing topic", () => {
    return request(app)
      .get("/api/articles?topic=katas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist");
      });
  });
});

describe("GET /api", () => {
  test("should return all endpoints, including description, possible queries and example response", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        for (const endpoint in body) {
          expect(body[endpoint]).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              queries: expect.any(Object),
              exampleResponse: expect.any(Object),
            })
          );
        }
      });
  });
});
