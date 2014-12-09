/**
 * Created by rj on 11/24/14.
 */


var gulp      = require("gulp"),
    gutil     = require("gulp-util"),
    watch     = require("gulp-watch"),
    through   = require("through2"),
    config    = require("../config.paths.js"),
    traceur   = require("traceur");


// Compiler Options
var options = {
  modules: "instantiate",
  experimental: true
};

// Traceur compile in a stream!
/* Traceur node api is working! ...for now... */
var compileES6 = function(opts){
  return through.obj(function(file, enc, done){
    var es6,
        oldPath = file.path;

    if( file.isNull() ){
      this.push(file);
      return done();
    }

    // set module name
    opts.moduleName = oldPath.replace(config.client+"/", "").replace(/\.js$/, "");

    // if in components folder, set to script mode
    if( (new RegExp("^" + config.client + "/components")).test(oldPath) ){
      opts.script = true;
    }

    // Get ES6 File Content
    es6 = file.contents.toString("utf8");

    // Update File Object
    file.contents = new Buffer( traceur.compile(es6, opts) );
    file.path = oldPath; //oldPath.replace(/\.es6\.js$/, ".js"); TODO: Do we remove the .es6 postfix?

    // Log work
    gutil.log(
      "\n\tCompiling: " + oldPath +
      //"\n\tTo: " + file.path +
      "\n\tNamed: " + opts.moduleName
    );

    this.push(file);
    done();
  });
};

/*** dev task **/
gulp.task("traceur:dev", function(){

  return gulp.src(config.traceur.src)
    .pipe(compileES6(options))
    .pipe(gulp.dest(config.traceur.out.dev));

});


/*** watch task ***/
gulp.task("traceur:watch", function(done){
  //gulp.watch(config.traceur.src,  ["traceur:dev"]);

  watch(config.traceur.src)
    .pipe(compileES6(options))
    .pipe(gulp.dest(config.traceur.out.dev));

  done();
});

// TODO prod task

