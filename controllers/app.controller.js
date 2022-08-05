const {
  fetchOwners,
  fetchArticleById,
  changeArticleVotes,
  fetchUsers,
  fetchArticles,
  fetchCommentsById,
  addComment,
  removeComment
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
    res.status(200).send({ users });
  });
};

exports.getArticles = (req, res, next) => {
  const { sort_by: sortBy, order, topic } = req.query;
  fetchArticles(sortBy, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const { article_id: id } = req.params;

  fetchCommentsById(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id: id } = req.params;
  const { username, body } = req.body;
  addComment(id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) =>{
  const {comment_id: id} = req.params
  removeComment(id).then(()=>{
    res.sendStatus(204)
  }).catch(next)
}