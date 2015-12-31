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
    
    console.log('IMG')
    console.log(imageList);

    console.log('LINK')
    console.log(linkList);
    
}
//.pipe(fs.createWriteStream("fcatae.htm"));


