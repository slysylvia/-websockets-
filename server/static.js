
var koa     = require('koa'),
    send    = require('koa-send'),
    fs      = require('fs'),
    config  = require('../config.paths.js'),
    dev     = koa(),
    prod    = koa();

var serve = function(root, fallback){

  return function *(next){
    var stat;
    try{
      stat = fs.statSync(root+this.path);
      if( stat.isDirectory() ){
        throw new Error("Won't serve directory");
      }
      yield send(this, root+this.path);
    } catch (e) {
      //console.error(e);
      console.log('falling back for: ' + this.path);
      yield send(this, fallback);
    }

  };
};

dev.use(serve(config.dev, config.server.fallback.dev));
prod.use(serve(config.prod, config.server.fallback.prod));

module.exports = {
  get dev(){
    dev.listen(config.server.ports.dev);
    return dev;
  },
  get prod(){
    prod.listen(config.server.ports.prod);
    return prod;
  }
};
