const {
  fetchOwners,
  fetchArticleById,
  changeArticleVotes,
  fetchUsers,
} = require("../models/app.model.js");

exports.getTopics = (req, res, next) => {
  fetchOwners().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  const id = req.params.article_id;
  const { inc_votes } = req.body;
  if (!inc_votes) {
    next({ id: "custom", status: 400, msg: "Missing inc_votes or wrong key" });
  } else if (isNaN(inc_votes)) {
    next({ id: "custom", status: 400, msg: "Input must be a number" });
  }
  changeArticleVotes(id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({users})
  });
};
