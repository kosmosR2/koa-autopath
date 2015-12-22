var readDir = require('read-lib');
var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");


module.exports = function(routeDirPath,dirPath,ignore){
  var routers = readDir(routeDirPath,dirPath);
  var handlers = getQueryRoute(ignore,routers);
  console.log(routers);
  return function*(next){
    var kos = this;
    var paths = this.request.url.split('?')[0].split('/');
 	  paths = paths.filter(function(v){
		  if(v == ""){
			  return false;
		  }else{
			  return true;
		  }
	  });
 	  var method = this.request.method.toLowerCase();
    var handler;
    if(paths.length == 0){
      handler =  routers['index'];
    }else{
      handler = handlers(paths);
    }
	  if(handler && handler[method]){
		  yield handler[method](kos);
	  }else{
		  yield next;
	  }
  };
};


function isObjectId(id){
  if(id == null) return false;
  if(typeof id == 'number')
    return true;
  if(typeof id == 'string') {
    return id.length == 12 || (id.length == 24 && checkForHexRegExp.test(id));
  }
  return false;
}

function getQueryRoute(ignore,routers){
  if(!ignore){
    ignore = isObjectId;
  }
  return function(paths){
	  var pointer = {};
	  pointer = routers;
	  for(var x = 0;x < paths.length;x ++){
      if(!ignore(paths[x])){
		    pointer = pointer[paths[x]];
		    if(!pointer){
			    return false;
		    }
      }
	  }
	  return pointer;
  };
}

