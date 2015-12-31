// busca todas as URL

var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var URL = require('url');
// var OUTPUTDIR = 'output/';
// 
// fs.mkdir(OUTPUTDIR, function(err) {
// 
//     // ignore err  
//     
// });

function example() {
    
    findBlogUrls('http://blogs.msdn.com/b/fcatae/default.aspx', function(lista) {
        console.log('  Total: ' + lista.length);
    })

}

function findBlogUrls(page, callback) {
    
    findBlogIndex(page, function(links) {

        var lista = [];
        var pendingGatherUrls = links.length;
    
        links.forEach(function(baseurl) {
            
            gatherUrls(baseurl, function(links) {
                
                pendingGatherUrls--;
                
                lista = lista.concat(links);

                if( pendingGatherUrls == 0 ) {
                    finishedGatherUrls();
                }
            });
            
        })

        function finishedGatherUrls() {
            callback(lista);
        }    
            
    });

}


function findBlogIndex(url, callback) {

    var parsedUrl = URL.parse(url);
    var baseUrl = parsedUrl.protocol + '//' + parsedUrl.host 
    
    var finder = /.*default.aspx\?PageIndex=(\d*)$/;
    
    request( url, function (err, res, body) { 
      
        var $ = cheerio.load(body);
        
        var links = $('a')
            .map(function() {
                
                var link = String( $(this).attr('href') );
                var match = link.match(finder);                
                
                return match && (baseUrl + match[0]);
                
            }).get();
        
        callback(links);              
        
    });
    
}

function gatherUrls(baseurl, callback) {

    var parsedUrl = URL.parse(baseurl);
    var baseUrl = parsedUrl.protocol + '//' + parsedUrl.host 
    
    request( baseurl, function (err, res, body) { 
      
        var $ = cheerio.load(body);
        
        var postlist = $('.blog-post-list .content-list .content-item');
        
        var links = postlist
            .map(function(i, post) {
            
                var postname = $(post).find('.post-name');
                var elem = postname.find('a');            
                
                //var name = elem.text();
                var link = baseUrl + elem.attr('href');
                
                return link;            
            }).get();
        
        callback(links);
        
    });
    
}

exports.exec = findBlogUrls;