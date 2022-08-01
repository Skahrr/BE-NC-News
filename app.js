const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
} = require("./controllers/app.controller.js");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

///////////////ERROR HANDLING

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ status: 400, msg: "Bad Request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    res.status(404).send(err)
});

module.exports = app;
