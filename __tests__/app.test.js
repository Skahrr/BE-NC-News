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
  test('should respond with 404 error when passed a valid id but doesnt exist on db', ()=>{
    return request(app).get('/api/articles/123123').expect(404).then(({body})=>{
        expect(body.msg).toBe('ID not found')
    })
  })
});

describe('PATCH /api/articles/article_id', ()=>{
    test('status 204: should increment/decrement the votes of an article and return a msg', ()=>{
        return request(app).patch('/api/articles/2').send({inc_votes: 5}).expect(204)
    });
    test('status 404: id not found', ()=>{
        return request(app).patch('/api/articles/123123').send({inc_votes: 5}).expect(404).then(({body})=>{
            expect(body.msg).toBe('ID not found')
        })
    });
    test('status 400: bad request', ()=>{
        return request(app).patch('/api/articles/paco').send({inc_votes: 5}).expect(400).then(({body})=>{
            expect(body.msg).toBe('Bad Request!')
        })
    });
    test('status 400: negative votes', ()=>{
        return request(app).patch('/api/articles/2').send({inc_votes: -5}).expect(400).then(({body})=>{
            expect(body.msg).toBe('Article can not have negative votes')
        })
    })
})