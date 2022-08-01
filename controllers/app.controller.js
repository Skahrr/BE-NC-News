const { fetchOwners, fetchArticleById } = require("../models/app.model.js");

exports.getTopics = (req, res, next) => {
  fetchOwners().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticleById(id).then((article) => {
    res.status(200).send({ article });
  }).catch(next);
};
