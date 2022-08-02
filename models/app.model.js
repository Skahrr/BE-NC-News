const db = require("../db/connection.js");
exports.fetchOwners = () => {
  return db.query("SELECT * FROM topics").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
      return article;
    });
};

exports.changeArticleVotes = (id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, id]
    )
    .then((res) => {
      const article = res.rows;

      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else if (article[0].votes < 0) {
        return Promise.reject({
          id: "custom",
          status: 400,
          msg: "Article can not have negative votes",
        });
      } else if (res.rowCount === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else {
        return article;
      }
    });
};
