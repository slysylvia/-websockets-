/**
 * Created by rj on 11/24/14.
 */


var gulp      = require("gulp"),
    gutil     = require("gulp-util"),
    through   = require("through2"),
    config    = require("../config.paths.js"),
    traceur   = require("traceur");

gulp.task("traceur:watch", function(done){
  gulp.watch(config.traceur.src,  ["traceur:dev"]);
  done();
});


// Compiler Options
var options = {
  modules: "instantiate",
  experimental: true
};

// Traceur compile in a stream!
/* Traceur node api is working for now! */
var compileES6 = function(opts){
  return through.obj(function(file, enc, done){
    var es5, es6, moduleName, newPath;

    if( file.isNull() ){
      this.push(file);
      return done();
    }

    moduleName = file.path.replace(config.client+"/", "");
    newPath = file.path; //file.path.replace(/\.es6\.js$/, ".js");

    opts.moduleName = moduleName;
    es6 = file.contents.toString("utf8");
    es5 = traceur.compile(es6, opts);
    file.contents = new Buffer(es5);
    file.path = newPath;

    gutil.log(
      "Compiling: " + file.path +
      " To: " + newPath +
      " With name: " + moduleName
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


// TODO prod task


/*
Command Line Options as of 11-24-2014

  Options:
    --type-assertion-module <path>                            Absolute path to the type assertion module.
    --modules <amd, commonjs, instantiate, inline, register>  select the output format for modules
    --moduleName <string>                                     __moduleName value, + sign to use source name, or empty to omit
    --outputLanguage <es6|es5>                                compilation target language
    --source-maps [file|inline|memory]                        sourceMaps generated to file or inline with data: URL
    --experimental                                            Turns on all experimental features
    --arrow-functions [true|false|parse]
    --block-binding [true|false|parse]
    --classes [true|false|parse]
    --computed-property-names [true|false|parse]
    --default-parameters [true|false|parse]
    --destructuring [true|false|parse]
    --for-of [true|false|parse]
    --generators [true|false|parse]
    --numeric-literals [true|false|parse]
    --property-methods [true|false|parse]
    --property-name-shorthand [true|false|parse]
    --rest-parameters [true|false|parse]
    --spread [true|false|parse]
    --template-literals [true|false|parse]
    --unicode-escape-sequences [true|false|parse]
    --unicode-expressions [true|false|parse]
    --annotations [true|false|parse]
    --array-comprehension [true|false|parse]
    --async-functions [true|false|parse]
    --exponentiation [true|false|parse]
    --generator-comprehension [true|false|parse]
    --symbols [true|false|parse]
    --types [true|false|parse]
    --member-variables [true|false|parse]
    --comment-callback
    --debug
    --free-variable-checker
    --type-assertions
    --validate

  Examples:

    $ traceur a.js [args]
    $ traceur --out compiled.js b.js c.js
    $ traceur --dir indir outdir

*/

