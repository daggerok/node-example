express = require 'express'
router = express.Router()
parser = require 'body-parser'
urlencoded = parser.urlencoded extended: false

blocks =
  Fixed: 'fixed descr'
  Movable: 'movable descr'
  Rotating: 'rotating descr'

fixName = (name) ->
  name[0].toUpperCase() + name.slice(1).toLowerCase()

# /blocks or /block?limit=1
router.route('/')
  
  .get (req, res) ->
    unless req.query.limit
      res.json Object.keys(blocks)
    else
      last = req.query.limit - 1 if req.query.limit > 0
      res.json Object.keys(blocks)[0..last]

  .post urlencoded, (req, res) ->
    newBlock = req.body
    console.log "newBlock: #{JSON.stringify(newBlock)}"
    blocks[fixName newBlock.name] = newBlock.description
    res.status(201).json newBlock.name

# /blocks/fixed
router.route('/:name')
  
  .all (req, res, next) ->
    req.blockName = fixName req.params.name
    next()
  
  .get (req, res) ->
    # res.status(404).json("no descr found for #{req.params.name}") unless blocks[req.params.name]
    # res.json blocks[req.params.name]
    res.status(404).json("no descr found for #{req.blockName}") unless blocks[req.blockName]
    res.json blocks[req.blockName]

module.exports = router