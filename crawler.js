var request = require('request');

var lista = [
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/24/set-showplan-text.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/17/sp-detach-db.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/10/dbcc-dbreindex.aspx'
    ];

for(var i=0; i<lista.length; i++) {
    var page = lista[i];
    
    request(page, function(error, response, body) {
       console.log(page); 
    });
}

// var fs = require("fs");
// request("http://blogs.msdn.com/fcatae").pipe(fs.createWriteStream("fcatae.htm"));