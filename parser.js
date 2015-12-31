var cheerio = require('cheerio');
var request = require('request');
var fs = require("fs");

request('http://blogs.msdn.com/b/fcatae/archive/2015/12/15/microsoft-open-source.aspx', function(error, request, body) {
    processPage(body);
});

function processPage(body) {
    var document = cheerio.load(body);

    var title = document('.post-name').text();
    var content = document('.post-content').html();
    
    processResult(title, content, cheerio.load(content) );
}

function processResult(title, content, $) {
    console.log("title: " + title);
    
    var imgs = $('img');
    var hrefs = $('a');
    
    var imageList = imgs.map(function() {
        return $(this).attr('src');
        }).get();
    
    var linkList = hrefs.map(function() {
        return $(this).attr('href');
    }).get();    
    
//     console.log('IMG')
//     console.log(imageList);
// 
//     console.log('LINK')
//     console.log(linkList);
        
    getExternalImage(imageList[0]);
}

var cache = {};

function getExternalImage(url) {
    console.log(url);

    request( {url: url, encoding: null} , function(error, request, body) {
       cache[url] = body;

       var contentType = request.headers['content-type'];
       var contentData = body.toString('base64');
       
       fs.writeFileSync('fcatae.htm', `<img src="data:${contentType};base64,${contentData}">`);
       
    });    
        
    request(url).pipe(fs.createWriteStream("fcatae.png"));
    
}


