/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('geoanno'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
var positionStore = {};
var timerStore = {};
var updateStoreTime = function(param){
  clearTimeout(timerStore[param.accountId]);
  timerStore[param.accountId] = setTimeout(function(){
    delete positionStore[param.accountId];
  }, 30*60*1000);
}
app.post('/currentPosition', function(req, res){
  positionStore[req.body.accountId] = req.body;
  updateStoreTime(req.body);
  res.json({});
});
app.post('/getMembers', function(req, res){
  res.json(positionStore);
});

io.sockets.on('connection', function(socket) {
	socket.on('currentPosition', function(data) {
		socket.broadcast.emit('position', data);
	});
});
server.listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
