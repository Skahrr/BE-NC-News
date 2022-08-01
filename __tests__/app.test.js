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

describe('GET /api/topics', ()=>{
    test('serves an array of all topics', ()=>{
       return request(app).get('/api/topics').expect(200).then(({body})=>{
        const expected = [
            {
              description: 'The man, the Mitch, the legend',
              slug: 'mitch'
            },
            {
              description: 'Not dogs',
              slug: 'cats'
            },
            {
              description: 'what books are made of',
              slug: 'paper'
            }
          ]
        expect(body.topics).toEqual(expected)
       })
    })
})