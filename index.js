var readDir = require('read-lib');
var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");


module.exports = function(routeDirPath,dirPath,ignore){
  var routers = readDir(routeDirPath,dirPath);
  return function(req,res,next){
    var paths = req.baseUrl.split('/');
 	  paths = paths.filter(function(v){
		  if(v == ""){
			  return false;
		  }else{
			  return true;
		  }
	  });
 	  var method = req.method.toLowerCase();
    var handler;
    if(paths.length == 0){
      handler =  routers['index'];
    }else{
      handler = getQueryRoute(ignore,routers)(paths);
    }
	  if(handler && handler[method]){
		  return handler[method](req,res,next);
	  }else{
		  return next();
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


