express = require 'express'
router = express.Router()

router.route('/')
  
  .get (req, res) ->
    console.log 'get routes'
    res.status 200
    res.end()
  
  .post (req, res) ->
    console.log 'post routes'
    res.status 201
    res.end()

module.exports = router