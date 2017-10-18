gulp = require "gulp"
coffee = require "gulp-coffee"
require "colors"

log = (error) ->
  console.log [
      "BUILD FAILED: #{error.name ? ''}".red.underline
      "\u0007" # beep
      "#{error.code ? ''}"
      "#{error.message ? error}"
      "in #{error.filename ? ''}"
      "gulp plugin: #{error.plugin ? ''}"
    ].join "\n"
  this.end()

gulp.task "coffee", ->
  gulp.src("./coffee/**/*.coffee", base: "./coffee/")
    .pipe(coffee bare: true)
      .on("error", log)
    .pipe(gulp.dest "./")

gulp.task "default", ["coffee"]

gulp.task "watch", ["default"], ->
  gulp.watch "./**/*.*", ["coffee"]
