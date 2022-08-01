const db = require('../db/connection.js')
exports.fetchOwners = ()=>{
    return db.query('SELECT * FROM topics').then(({rows: topics})=>{
        return topics
    })
};

exports.fetchArticleById = (id)=>{
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then(({rows: [article]})=>{
        if(!article){
            return Promise.reject({status: 404, msg: 'ID not found'})
        }
        return article
    })
}