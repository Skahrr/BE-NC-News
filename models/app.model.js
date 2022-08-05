const db = require("../db/connection.js");
const articles = require("../db/data/test-data/articles.js");
exports.fetchOwners = () => {
  return db.query("SELECT * FROM topics").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (id) => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comment_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id= comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [id]
    )
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

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows: users }) => {
    return users;
  });
};

exports.fetchArticles = (sortBy = 'created_at', order = 'DESC', topic) => {
  const validSortby = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes']
  const validOrder = ['ASC', 'DESC']
  const validTopics = ['mitch', 'cats', 'paper']
  
  let optionalWhere = ` `
  if(topic){
    optionalWhere = ` WHERE topic = '${topic}' `
  }
  if(validSortby.includes(sortBy) && validOrder.includes(order)){
    return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comment_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id= comments.article_id`+ optionalWhere +  `GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`)
    .then(({ rows: articles }) => {

      if(!articles.length){
        if(!validTopics.includes(topic)){
          return Promise.reject({id: 'custom', status: 404, msg: 'Topic does not exist'})
        }
        return Promise.reject({id: 'custom', status: 200, msg: '0 matches found'})
      }
      return articles;
    });
  }else{
    return Promise.reject({code: '22P02'})
  }
  
};

exports.fetchCommentsById = (id) => {
  return db
    .query(
      "SELECT body, votes, author, comment_id, created_at FROM comments WHERE article_id = $1",
      [id]
    )
    .then(({ rows: comments }) => {
      if (comments.length === 0) {
        const checkId = () => {
          return db.query(
            "SELECT article_id FROM articles WHERE article_id = $1",
            [id]
          );
        };
        return checkId().then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "ID not found" });
          } else {
            return Promise.reject({
              id: "custom",
              status: 200,
              msg: "Sorry, this article has no comments",
            });
          }
        });
      }
      return comments;
    });
};

exports.addComment = (id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (body, votes, author, article_id) VALUES ($1, 0, $2, $3) RETURNING *;",
      [body, username, id]
    )
    .then(({ rows: comment }) => {
      return comment;
    });
};

exports.removeComment = (id)=>{
  return db.query('DELETE FROM comments WHERE comment_id = $1', [id]).then(({rowCount})=>{
    if(!rowCount){
      return Promise.reject({code: '23503'})
    }
  })
}