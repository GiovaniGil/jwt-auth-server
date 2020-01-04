var app = require('./config/server');
var http = require('http').Server(app);
var config = require('./env.config');

var port = process.env.PORT || config.port
http.listen(port, function() {
    console.log("servidor rodando na porta:", config.port);
})
