var fs = require('fs');
var http = require('http');
var path = require('path');
var youtubedl = require('youtube-dl');
var YOUTUBE_DOMAIN = 'http://www.youtube.com';

http.createServer(function (req, res) {
    var _url;
    if (req.url.match(/download/)) {
        _url = req.url.replace(/download/, '');
        //_url =  path.join(YOUTUBE_DOMAIN, _url);
        console.log('Youtube URL IF: ', _url);
        var video = youtubedl(YOUTUBE_DOMAIN + _url,
            // Optional arguments passed to youtube-dl.
            ['--format=18'],
            // Additional options can be given for calling `child_process.execFile()`.
            {cwd: __dirname});

        video.on('info', function (info) {
            console.log('Download started');
            console.log('filename: ' + info.filename);
            console.log('size: ' + info.size);
        });
        video.pipe(res);
    } else {
        console.log('Youtube URL ELSE: ', YOUTUBE_DOMAIN + req.url);
        youtubedl.getInfo(YOUTUBE_DOMAIN + req.url, [], function (err, info) {
            var url = '';
            var anyUrl = '';
            if (err) {
                fs.readFile('./index.html',function(err,data){
                    res.end(data.toString());
                });
            } else {
                info.formats.forEach((media)=> {
                    if (media.ext == 'mp4') {
                        anyUrl = media.url;
                    }
                    if (media.ext == 'mp4' && media.height == 480) {
                        url = media.url;
                    }
                });
                res.writeHead(301, {
                        Location: url || anyUrl
                    }
                );
                res.end();
                console.log('Actual URL: ' + (url || anyUrl));
            }
        });
    }


}).listen(8899, function () {
    console.log('>>> Server listening on PORT: 8899');
});