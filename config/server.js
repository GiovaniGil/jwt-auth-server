var express = require("express");
var load = require("express-load");
var bodyParser = require("body-parser");

var app = express();
//use recebe funções que serão usadas pelo app na ordem
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});


//express-load - carrega os arquivos
load('routes', { cwd: 'app' })
    //.then('infra')
    .into(app);



app.use(function (req, res, next) {
    res.status(400).json({ message: 'erros/400 => Bad Request' });
});

app.use(function (error, req, res, next) {
    if (process.env.NODE_ENV == 'production') {
        res.status(500).json({ message: 'erros/500 => Internal Error' });
        return;
    } else {
        next(error);
    }
});

module.exports = app;