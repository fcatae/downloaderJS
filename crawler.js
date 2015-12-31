var request = require('request');

var lista = [
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/24/set-showplan-text.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/17/sp-detach-db.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/10/dbcc-dbreindex.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/05/03/dbcc-indexdefrag.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/04/26/dbcc-ind.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/04/19/sp-spaceused.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/04/12/dbcc-page.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/04/05/dbcc-showcontig.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/03/29/dbcc-dropcleanbuffers.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/03/22/set-statistics-io.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/03/15/checklist-performance-do-servidor-sql.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/03/08/checklist-performance-do-servidor-windows.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/03/01/perfmon-monitorando-o-storage.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/02/23/perfmon-monitorando-o-buffer-manager.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/02/09/contadores-do-perfmon.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/02/02/os-7-grandes-mitos-do-perfmon-parte-3.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/01/26/os-7-grandes-mitos-do-perfmon-parte-2.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/01/19/os-7-grandes-mitos-do-perfmon-parte-1.aspx'
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