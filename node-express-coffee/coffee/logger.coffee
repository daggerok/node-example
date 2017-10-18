module.exports = (req, res, next) ->
  start = +new Date()
  
  res.on 'finish', ->
    process.stdout.write "#{req.method} to #{req.url}\ntook #{+new Date() - start} ms\n"
  next()