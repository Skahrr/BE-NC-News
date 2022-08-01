const db = require('../db/connection.js')
exports.fetchOwners = ()=>{
    return db.query('SELECT * FROM topics').then(({rows: topics})=>{
        return topics
    })
}