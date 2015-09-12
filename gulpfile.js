var gulp = require('gulp');
var del = require('del');
var react = require('gulp-react');


gulp.task('default', ['jsx', 'copy_react', 'copy_bootstrap', 'copy_jquery'], function() {
  // place code for your default task here
});


gulp.task('watch', function() {
  gulp.watch('./jsx/**/*.jsx', ['jsx']);
});


gulp.task('jsx', function () {
    return gulp.src('./jsx/*.jsx')
        .pipe(react())
        .on('error', function(err) {
          console.error('JSX ERROR in ' + err.fileName);
          console.error(err.message);
          this.end();
        })
        .pipe(gulp.dest('./static/js'));
});


gulp.task('copy_react', function() {
  gulp.src(['./bower_components/react/react*.js'])
    .pipe(gulp.dest('./static/js'));
});


gulp.task('copy_jquery', function() {
  gulp.src(['./bower_components/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('./static/js'));
});


gulp.task('copy_bootstrap', function() {
  // gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}')
  css_files = ['bootstrap.min.css', 'bootstrap-theme.min.css']
  js_files = ['bootstrap.min.js']
  font_files = ['*']

  action_map = {"css": css_files, "js": js_files, "fonts": font_files}

  for (var a in action_map) {
    f = action_map[a]
    f2 = f.map(function(item) {
      return './bower_components/bootstrap/dist/' + a + "/" + item
    })

    dest = './static/' + a

    gulp.src(f2).pipe(gulp.dest(dest));
  }

});


gulp.task("clean_static", function() {
  del(['static/**', '!static']).then(function (paths) {
      list_of_del = [''].concat(paths).join('\n -')
      console.log('Deleted files/folders:', list_of_del);
  });
});
