// busca todas as URL

var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var URL = require('url');
var OUTPUTDIR = 'output/';

fs.mkdir(OUTPUTDIR, function(err) {

    // ignore err  
    
});


gatherUrls('http://blogs.msdn.com/b/fcatae/default.aspx?PageIndex=90');


function gatherUrls(baseurl) {
    
    request( baseurl, function (err, res, body) { 
      
        var $ = cheerio.load(body);
        
        var postlist = $('.blog-post-list .content-list .content-item');
        
        postlist.each(function(i, post) {
            
            var postname = $(post).find('.post-name');
            var elem = postname.find('a');            
            
            var name = elem.text();
            var link = elem.attr('href');
            
            console.log(` Article: ${name} (${link})`);
        })            
        
    });

    
}