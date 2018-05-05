const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: "10mb"}));
app.use(bodyParser({
    uploadDir:"./img/"}
    ));
app.use(cookieParser());



app.use('/api/*', function (req, res, next) {
    //disable cache
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

//todo create  mock endpionts
app.use('/api', require("./routers/shared"));
app.use('/api/user', require("./routers/user"));
app.use('/api/business', require("./routers/business"));

app.get("/", function(req, resp) {
    resp.send("OK!");
});


server.listen(8000);

module.exports = app;
