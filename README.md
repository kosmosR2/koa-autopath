# autopath
distribution route depends on file path in express 

##install

    npm install autopath

##example
In `app.js` :

    app.use(require('autopath')('./router',__dirname,ignoreFunction));

Then,files in `./router` will get all request.

###example file structure

    router
      |
      |-route.js
      |-route
      |   |-map.js
      |   \-url.js
      \-data
          |-get.js
          |-post.js
          |-put.js
          \-delet.js

###result for this example
If you GET `/route/map`,then method `get` exported by `./router/route/map` will be called.
And if you wants to add a param between `route` and `map`,for example `/route/233/map`,
you shoud just match all your params in ignoreFunction.

###ignoreFunction

    var ignoreFunction = function(param){ 
      return /^[0-9]*$/.test(param);
    }

This function will make autopath ignore all-number params when pathfinding().
ObjectId of mongodb is ignore by default.Use your own ignoreFunction to pay attention to it again.
