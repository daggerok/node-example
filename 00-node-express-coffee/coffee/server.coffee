express = require 'express'
app = express()
port = 3000
logger = require './logger'
appRouter = require './routes/app'
blocksRouter = require './routes/blocks'

# middleware:
app.use express.static('./')
app.use logger
app.use '/app', appRouter
app.use '/blocks', blocksRouter

"""
# redirects
app.get '/wrong', (req, res) ->
  res.redirect 301, '/blocks'
app.get '/*', (req, res) ->
  res.redirect '/ '
# root
app.get '/', (req, res) ->
  res.sendFile "#{__dirname}/index.html"
"""

app.listen port, ->
  console.log "listening :#{port}"