const { fetchOwners, fetchArticleById, changeArticleVotes } = require("../models/app.model.js");

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


exports.updateArticleVotes = (req, res, next)=>{
    const id = req.params.article_id
    const {inc_votes} = req.body
    changeArticleVotes(id, inc_votes).then(()=>{
        res.sendStatus(204)
    })
}