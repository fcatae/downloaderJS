var request = require('request');

request('http://blogs.msdn.com/fcatae', function(error,response,body) {
    console.log(body);
})

// var fs = require("fs");
// request("http://blogs.msdn.com/fcatae").pipe(fs.createWriteStream("fcatae.htm"));