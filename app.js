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
var positionStore = {
  a:{
    accountId:'aaa',
    name:'testAccount-A',
    position:{
      latitude: 35.671651,
      longitude: 139.772861
    },
    updateTime: 1411719531129
  },
  b:{
    accountId:'bbb',
    name:'testAccount-B',
    position:{
      latitude: 35.669651,
      longitude: 139.770861
    },
    updateTime: 1411719531129
  }
};
var timerStore = {};
/** 
 * @param {Object} param
 *   @param {String} param.accountId
 *   @param {String} param.name
 *   @param {Object} param.position
 *     @param {Number} param.position.latitude
 *     @param {Number} param.position.longitude
 *   @param {Number} param.updateTime
 * 
 * 例)
 * {
 *   accountId:'XXXX',
 *   name:'*',
 *   position:{
 *     latitude: 35.670651,
 *     longitude: 139.771861
 *   },
 *   updateTime: 1411719531129
 * }
 */
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
server.listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
