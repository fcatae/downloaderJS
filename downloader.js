var fs = require('fs');

// hidden URL's
var list_hidden = [
    'http://blogs.msdn.com/b/fcatae/archive/2016/09/01/as-9-regras-ninjas-de-performance.aspx',
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
    'http://blogs.msdn.com/b/fcatae/archive/2016/01/19/os-7-grandes-mitos-do-perfmon-parte-1.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/01/12/perfmon-falso-sentido-de-monitoracao.aspx',
    'http://blogs.msdn.com/b/fcatae/archive/2016/01/05/monitore-o-consumo-de-recursos-do-banco-de-dados.aspx'
    ];

// 0. create OUTPUT folder
try {
    //fs.mkdirSync('output');
    // MISSING output folder = missing SECRETS!    
} catch(e) {}

// 1. check json file. exists?
var filelist = checkFilelistJson('output/filelist.json');

if(!filelist) {

    var gatherurl = require('./gatherurl');
    gatherurl.exec('http://blogs.msdn.com/b/fcatae/default.aspx', function(list) {
    
        filelist = list.concat(list_hidden);

        saveFilelistJson('output/filelist.json', filelist);
        
        completeStep1();        
    })
}
else {
    completeStep1();
}

function completeStep1() {
    console.log('Step 1. filelist.json = ' + filelist.length);
    
    startStep2();
}

var navigate;

// 2. open json file and check pages. downloaded?
function startStep2() {
    
    var secret = require('./output/secret');
    var output_dir = 'output/';   

    navigate = require('./navigate')
    navigate.createCache(secret, filelist, output_dir);
    
    console.log('Step 2. Cache created at: ' + output_dir);
    
    startStep3();
}

// 3. open pages and validate the cache. cached?
function startStep3() {
    console.log('Step 3. Start downloading files... ');
    
    var parser = require('./parser')
    
    filelist.forEach(function(filename) {
       
       var post_content = navigate.get(filename);

       parser.create(post_content);
       
    });
}

// parser logic

function createFilelistJson(filename) {
}

function checkFilelistJson(filename) {
    
    var filelist;
        var data;
    
    try {
        data = fs.readFileSync(filename, 'utf8');        
        filelist = JSON.parse(data);     
    }
    catch(e) {}
        
    if( filelist && filelist.length && filelist.length > 0 ) {
        return filelist;
    }    
}

function saveFilelistJson(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data), 'utf8');
}