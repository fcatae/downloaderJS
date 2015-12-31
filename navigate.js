var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var OUTPUTDIR = 'output-hidden/';

var request;

function example() {

    var secret = require('./output/secret.js');

    init(secret, 'output-hidden/');
        
    //var options = {url: url, headers: { 'Cookie' : 'blablabla' } };        

    var lista = [
        'http://blogs.msdn.com/b/fcatae/archive/2016/09/01/as-9-regras-ninjas-de-performance.aspx',
        'http://blogs.msdn.com/b/fcatae/archive/2016/05/24/set-showplan-text.aspx',
        'http://blogs.msdn.com/b/fcatae/archive/2016/05/17/sp-detach-db.aspx'
        ];

    lista.forEach(function(url) {
        openHiddenUrl(url);
    });        
}

function init(secret, output_dir) {
    OUTPUTDIR = output_dir || OUTPUTDIR;
    initAuthRequest(secret.url, secret.token);
    
    try {
        fs.mkdirSync(OUTPUTDIR);    
    } catch(e) {}    
}

function initAuthRequest(cookieUrl, cookieDataString) {
    
    var cookieData = request.cookie(cookieDataString);

    var cookieJar = request.jar();
    cookieJar.setCookie(cookieData, cookieUrl);    
    
    request = request.defaults({ jar: cookieJar});    
}
    
function openHiddenUrl(url, filename) {
    
    filename = filename ||  createFilename(url);
    
    request( url, function (err, res, body) {
    
        var $ = cheerio.load(body);
        
        var title = $('.post-name').text();  
        var content = $('.post-content').html();

        //console.log(title);      
        var urlpage = $('form[name=aspnetForm]').attr('action');
        
        //console.log(urlpage);        

        fs.writeFileSync(OUTPUTDIR + filename, $.html());
    
    });    

}    

function createFilename(url) {

    var components = url.split('/');
    var filename = components.pop();
    
    return filename;
}

exports.init = init; 
exports.create = openHiddenUrl;