//index.js in c:/users/mario/nodejs/node application/MyApp
/*
* This app listens on port 3000.
* When someone posts anything to router/hello, it returns a welcome message in JSON format.
* 
* The app uses only HTTP
*/
//dependencies
var http = require('http');
var url = require('url');
var config = require('./config');



//The http server should respond to all requests with a string

//instantiate the HTTP server
var httpServer = http.createServer(function (req, res){ 
  
    //get the URL and parse it
    var parsedUrl = url.parse (req.url, true);
    
    //get the path of the URL
    var path = parsedUrl.pathname; //untrimmed
    var trimmedPath = path.replace (/^\/+|\/+$/g, '');
    
    //get the HTTP Method
    var method = req.method.toLowerCase();  //toLowerCase for consistency sake. It might as well be toUpperCase.
    
    var reply = 'Hi, welcome to Hello! Thank you for calling';
         
        //choose the handler this request should go to.
        //if one is  not found use the notFound handler.
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        
        //construct the data object to send to the handlers
        var data = {
            'trimmedPath': trimmedPath,
            'method': method,
            'payload': reply
        };
        
        //route the request to the handler specified in the router
        //we expect back a status code and a payload.
        
        chosenHandler(data, function(statusCode, payload){
            //use the status code called back by the handler or default to 200.
            statusCode = typeof(statusCode)=='number' ? statusCode: 200;
            //use the payload called back by the handler or default to an empty object. The only type we'll accept is an object.
            payload = typeof(payload) == 'object' ? payload: {};
            
            //we cannot send an object to the user. We have to send a string
            //so convert the payload to a string
            var payloadString = JSON.stringify(payload);  //NB this is not the payload we received. It's the one we are sending the user.
            
            //return the response
            res.setHeader('Content_Type', 'application/json');  //informing user that we are returning JSON
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Returning this response: ', statusCode, payloadString);
        }) ;
        
    });


//Start the HTTP server
httpServer.listen(config.httpPort, function(){
    console.log('The server is listening on port '+config.httpPort);
}); 

//------------------------------------------------------------------

//define the handlers
var handlers = {};  //an object

//Hello handler
handlers.hello = function(data, callback){
   
    callback(406,{'name':'hello handler'});
}

//not found handler
handlers.notFound = function(data, callback){
    callback(404);  //no payload needed
}

//define a request router (an object)
var router = {
    'hello':handlers.hello
};
