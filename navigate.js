var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var OUTPUTDIR = 'output-hidden/';

var secret = require('./output/secret.js');


var request = initAuthRequest(secret.url, secret.token);


function initAuthRequest(cookieUrl, cookieDataString) {
    
    var cookieData = request.cookie(cookieDataString);

    var cookieJar = request.jar();
    cookieJar.setCookie(cookieData, cookieUrl);    
    
    return request.defaults({ jar: cookieJar});
    
}

//var options = {url: url, headers: { 'Cookie' : 'blablabla' } };        

var lista = [
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


fs.mkdir(OUTPUTDIR, function(err) {

    // ignore err
    
    lista.forEach(function(url) {
        openHiddenUrl(url);        
    });    
    
});
    
function openHiddenUrl(url) {
    
    request( url, function (err, res, body) {
    
        var $ = cheerio.load(body);
        
        var title = $('.post-name').text();  
        var content = $('.post-content').html();

        console.log(title);      

        fs.writeFileSync(OUTPUTDIR + createFilename(url), $.html());
    
    });    

}    


function createFilename(url) {

    var components = url.split('/');
    var filename = components.pop();
    
    return filename;
}
