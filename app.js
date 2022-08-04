const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  updateArticleVotes,
  getUsers,
  getArticles,
  getCommentsById,
  postComment
} = require("./controllers/app.controller.js");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", updateArticleVotes);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get('/api/articles/:article_id/comments', getCommentsById)
app.post('/api/articles/:article_id/comments', postComment)

///////////////ERROR HANDLING

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ status: 400, msg: "Bad Request!" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.id === "custom") {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  res.status(404).send(err);
});

module.exports = app;
