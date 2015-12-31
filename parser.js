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
    
    processResult(content, finishImageProcessing);    
    
    console.log("title: " + title);
    
    function finishImageProcessing(html) {
        fs.writeFileSync(title + '.htm', html);
    }
}

function processResult(content, callback) {
    
    var $ = cheerio.load(content);
    
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
   
    processImages($, function() {
        callback($.html());
    });
    
}


function processImages($, callback) {
    
    var tasks = 0;
    
        $('img').each(function() {
        createInlineImage($(this));
    });    
    
    function createInlineImage(elem) {        
                
        tasks++;   
        var src = elem.attr('src');                   
                
        getExternalImage(src, function(imageSrc) {            
            elem.attr('src', imageSrc);
            
            console.log(src);
            
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
            
        //request(url).pipe(fs.createWriteStream("fcatae.png"));
        
    }
}



