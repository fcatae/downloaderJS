var metaweblog = require('./lib/metaweblog').MetaWeblog;

var blog = new MetaWeblog('http://blogs.msdn.com/metaweblog.aspx');
blog.getUsersBlogs('fcatae', 'fcatae', 'xxx', function(err, bloginfos) {
    console.log(bloginfos);
});