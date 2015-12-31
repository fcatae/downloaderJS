var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var URL = require('url');
var OUTPUTDIR = 'output/';

fs.mkdir(OUTPUTDIR, function(err) {

    // ignore err
    processUrl('http://blogs.msdn.com/b/fcatae/archive/2015/12/15/microsoft-open-source.aspx');
    
});


function processUrl(url) {
    
    request(url, function(error, request, body) {
        processPage(url, body);
    });

}

function processPage(url, body) {
    var document = cheerio.load(body);
    
    var title = document('.post-name').text();    
    var content = document('.post-content').html();
    
    console.log("title: " + title);

    fs.writeFileSync(OUTPUTDIR + createFilename(url), document.html());
    
    processResult(content, finishProcessing);    
    
    function finishProcessing(html) {
        var filename = createFilename2(url);
        console.log("filename: " + filename);
        fs.writeFileSync(OUTPUTDIR + filename, html);
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
        saveExternalImage(href);
                
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

            saveToImageDisk(url, body);
            
            callback(imageSrc);
                    
        });    
        
    }
}

function saveToImageDisk(url, body, callback) {

    var path = URL.parse(url).path;
    var filename = path.split('/').pop();
     
    fs.writeFile(OUTPUTDIR + filename, body, callback);
    
}

function saveExternalImage(url, callback) {

    var path = URL.parse(url).path;
    var filename = path.split('/').pop();
     
    if( filename && filename.match(/(PNG|JPG)$/i) ) {

        request( {url: url, encoding: null} , function(error, response, body) {
            //console.log('writing: ' + OUTPUTDIR + filename)
            fs.writeFile(OUTPUTDIR + filename, body, callback);
        });   

    }
    
}

function createFilename(url) {

    var components = url.split('/');
    var filename = components.pop();
    
    return filename;
}

function createFilename2(url) {

    //'http://blogs.msdn.com/b/fcatae/archive/2015/12/15/microsoft-open-source.aspx'
    
    var components = url.split('/');
    var filename = components.pop();
    var day = components.pop();
    var month = components.pop();
    var year = components.pop();
    
    return `${year}${month}${day}-${filename}.html`;
}

function printFilename(src) {

    var path = URL.parse(src).path;
    var filename = path.split('/').pop();
    console.log('   ' + filename);
    
}

