"use strict";
var gulp = require( "gulp" ),
  gutil = require( "gulp-util" ),
  Dgeni = require( "dgeni" );

gulp.task( "docs:components", function() {
  var dgeni;

  try {
    dgeni = new Dgeni([ require( "../docs/dgeni-packages/components.js" ) ]);
    return dgeni.generate();
  } catch ( error ) {
    gutil.log( error.stack );
    throw error;
  }
});

gulp.task( "docs:less", function() {
  var dgeni;

  try {
    dgeni = new Dgeni([ require( "../docs/dgeni-packages/less.js" ) ]);
    return dgeni.generate();
  } catch ( error ) {
    gutil.log( error.stack );
    throw error;
  }
});
