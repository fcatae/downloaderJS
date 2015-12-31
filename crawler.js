var request = require('request');

var lista = [
    'http://blogs.msdn.com/b/fcatae/archive/2016/09/01/as-9-regras-ninjas-de-performance.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/24/set-showplan-text.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/17/sp-detach-db.aspx'
    ];

// simple parallelism

// var i;
// var page;
// 
// for(i=0; i<lista.length; i++) {
//    
//     (function requestPage(page) {
//         
//         console.log('page request');
//         request(page, function(error, response, body) {
//             console.log(page); 
//         });
//         
//     })(lista[i]);
//     
// }

var page_number = 0;
var workers = 0;
var TOTAL_WORKERS = 4;

function continueCrawler() {
    
    if( workers < TOTAL_WORKERS && page_number < lista.length ) {
    
        (function requestPage(page) {
        
        page_number++;
        workers++;
        console.log('page request');
        
        request(page, function(error, response, body) {
            workers--;
            console.log(page); 
            
            continueCrawler();
            });
        
        // function requestPage
        })(lista[page_number]);

        continueCrawler();        
    }        
}

continueCrawler();

// var fs = require("fs");
// request("http://blogs.msdn.com/fcatae").pipe(fs.createWriteStream("fcatae.htm"));