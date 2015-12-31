var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var URL = require('url');

request('http://blogs.msdn.com/b/fcatae/archive/2015/12/15/microsoft-open-source.aspx', function(error, request, body) {
    processPage(body);
});

function processPage(body) {
    var document = cheerio.load(body);

    var title = document('.post-name').text();
    var content = document('.post-content').html();
    
    console.log("title: " + title);
    
    processResult(content, finishProcessing);    
    
    function finishProcessing(html) {
        fs.writeFileSync(title + '.htm', html);
    }
}

function processResult(content, callback) {
    
    var $ = cheerio.load(content);
    
    console.log('Links:');

    processLinks( $('a'), function(links) {        
        
        console.log('Images:');
        
        processImages( $('img'), function() {
            callback($.html());
        });
        
    });       
    
}

function processLinks(hrefs, callback) {

    var linkList = hrefs.map(function() {
        
        var href = cheerio(this).attr('href');
        printFilename(href);
                
        return href;
        
    }).get();    
    
    callback(linkList);
    
}

function processImages(images, callback) {
    
    var tasks = 0;
    
    images.each(function() {
        createInlineImage(cheerio(this));
    });    
    
    function createInlineImage(elem) {        
                
        tasks++;   
        var src = elem.attr('src');                   
            
        printFilename(src);
                
        getExternalImage(src, function(imageSrc) {            
            elem.attr('src', imageSrc);
            
            tasks--;
            
            if(tasks == 0) {
                callback();                 
            }
        });        
    }   
        
    function getExternalImage(url, callback) {

        request( {url: url, encoding: null} , function(error, response, body) {

            var contentType = response.headers['content-type'];
            var contentData = body.toString('base64');
            
            var imageSrc = `data:${contentType};base64,${contentData}`;

            callback(imageSrc);
                    
        });    
        
    }
}

function printFilename(src) {

    var path = URL.parse(src).path;
    var filename = path.split('/').pop();
    console.log('   ' + filename);
    
}

