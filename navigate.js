var cheerio = require('cheerio');
var request = require('request');

var secret = require('./output/secret.js');

var request = initAuthRequest(secret.url, secret.token);

var url = 'http://blogs.msdn.com/b/fcatae/archive/2016/05/24/set-showplan-text.aspx';


function initAuthRequest(cookieUrl, cookieDataString) {
    
    var cookieData = request.cookie(cookieDataString);

    var cookieJar = request.jar();
    cookieJar.setCookie(cookieData, cookieUrl);    
    
    return request.defaults({ jar: cookieJar});
    
}

//var options = {url: url, headers: { 'Cookie' : 'blablabla' } };        
    
request( url, function (err, res, body) {
    
    var $ = cheerio.load(body);
    
    var title = $('.post-name').text();    

    //console.log(res.headers);
    console.log(title);  
})
