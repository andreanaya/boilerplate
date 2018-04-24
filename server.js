var argv = require('yargs').argv;
 
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var chokidar = require('chokidar');
var handlebars = require('handlebars');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require("webpack-hot-middleware");
var configPath = path.resolve('./config/server.json');
var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
var configWebpack = require('./webpack.config.js')();

function templates(config) {
	var basedir = path.resolve(config.basedir);

	if(config.helpers) {
		var helpers = require(basedir+'/'+config.helpers);

		Object.keys(helpers).forEach(function(key) {
			handlebars.registerHelper(key, helpers[key]);
		});
	}

	chokidar.watch(basedir+'/**/**.hbs', {
		ignored: config.ignored,
		cwd: basedir
	})
	.on('add', function(path, event) {
		handlebars.registerPartial(path, fs.readFileSync(basedir+'/'+path, 'utf8'));
	})
	.on('change', function(path, event) {
		handlebars.registerPartial(path, fs.readFileSync(basedir+'/'+path, 'utf8'));
	});

	return function (filePath, options, callback) {
		var template = handlebars.compile(fs.readFileSync(filePath, 'utf8'));
		
		return callback(null, template(options));
	}
}



var app = express();

app.engine('hbs', templates(config.templates));
app.set('views', config.templates.basedir);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var compiler = webpack(configWebpack);

if(config.static) {
	config.static.forEach(function(item){
		app.use(item.alias, express.static(item.dir));
	})
}

if(process.argv[1].indexOf('server') >= 0) {
	app.use(webpackMiddleware(
		compiler,
		{
			publicPath: config.static && config.static.length > 0 ? config.static[0].alias : '/assets/',
			stats: {
				colors: true
			},
			noInfo: false
		}
	));

	app.use(webpackHotMiddleware(compiler));
}

if(config.sitemap) {
	function setRoute(children, route) {
		children.forEach(function(item) {
			var path = this.route+item.path+'/';

			routes[path] = {
				basePath: item.basePath,
				meta: item.meta,
				template: item.template,
				data: item.data,
			}

			if(item.children) setRoute(item.children, path);
		}, {route: route})
	}

	var sitemap = JSON.parse(fs.readFileSync(config.sitemap, 'utf8'));
	var routes = [];
	setRoute([sitemap], '');
	
	chokidar.watch(config.sitemap).on('change', function(path, event) {
		sitemap = JSON.parse(fs.readFileSync(config.sitemap, 'utf8'))
		routes = [];
		setRoute([sitemap], '');
	});

	app.use(function(req, res, next) {
		var route = routes[(req.path.slice(-1) == '/' ? req.path : req.path+'/')];
		
		if(route) {
			var options = {
				isDev: process.argv[1].indexOf('server') >= 0,
				template: route.template
			};

			if(route.meta) options.meta = route.meta;
			if(req.params) options.params = req.params;
			if(route.data) options.data = JSON.parse(fs.readFileSync(path.resolve(config.templates.basedir+'/'+route.data), 'utf8'));

			res.render(route.basePath, options);
		} else {
			res.status(404).send('Not found');
		}
	});
}

if(config.routess) {
	var routes = config.routes;

	function reduce(obj, route, index) {
		obj[route.path] = index;
		return obj;
	}

	var indexes = routes.reduce(reduce, {});

	chokidar.watch(configPath).on('change', function(path, event) {
		config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		routes = config.routes;

		indexes = routes.reduce(reduce, {});
	});

	app.use(function(req, res, next) {
		var route = routes[indexes[req.path]];
		
		if(route) {
			var options = {
				isDev: process.argv[1].indexOf('server') >= 0,
				template: route.template
			};

			if(route.meta) options.meta = route.meta;
			if(req.params) options.params = req.params;
			if(route.data) options.data = JSON.parse(fs.readFileSync(path.resolve(route.data), 'utf8'));

			res.render(route.basePath, options);
		} else {
			res.status(404).send('Not found');
		}
	});
}

var server = app.listen(process.env.PORT || 2000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Prototype listening at http://localhost:%s', port);
});