const {fetchOwners} = require('../models/app.model.js')

exports.getTopics = (req, res, next) =>{
    fetchOwners().then((topics)=>{
        res.status(200).send({topics})
    })
}