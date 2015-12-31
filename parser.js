var cheerio = require('cheerio');
var request = require('request');
var fs = require("fs");

request('http://blogs.msdn.com/b/fcatae/archive/2015/12/15/microsoft-open-source.aspx', function(error, request, body) {
    processPage(body);
});

function processPage(body) {
    var $ = cheerio.load(body);

    var title = $('.post-name').text();
    var content = $('.post-content').html();
    
    processResult(title, content, $);
}

function processResult(title, content, $) {
    console.log("title: " + title);
    
    // fs.writeFile('fcatae.htm', content);
    
    var imgs = $('img');
    var hrefs = $('a');
    
    console.log('IMG')
    imgs.each(function() {
        console.log('    ' + $(this).attr('src'));
    });
    
    console.log('LINK')
    hrefs.each(function() {
        console.log('    ' + $(this).attr('href'));
    });
    
    
}
//.pipe(fs.createWriteStream("fcatae.htm"));


