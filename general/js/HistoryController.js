import EventSystem from 'boilerplate/general/js/EventSystem.js';

let path, params, parentRoute, queryString;

function init(auto) {
	if(auto) document.body.addEventListener('click', onClick);

	let route = setState();

	parentRoute = route;

	window.history.replaceState(
		{
			route: route,
			parentRoute: route,
			data: {}
		},
		null,
		route
	);

	window.onpopstate = function(e) {
		let state = e.state;

		if(state == null) return;

		state.data.pop = true;

		if(state.route == state.parentRoute) {
			parentRoute = state.route;
		}

		onChange(setState(), state);
	};

	if ('scrollRestoration' in window.history) {
		window.history.scrollRestoration = 'manual';
	}

}

function navigate(location, data, silent) {
	data = data || {};

	let route = setRoute(location);

	if(data.target != 'lightbox' && data.target != 'modal') {
		parentRoute = route;
	}

	let state = {
		route: route,
		parentRoute: parentRoute,
		data: data
	}

	if(data.target != 'modal' && silent !== true) {
		window.history.pushState(state, null, route);
	}

	onChange(route, state);
}

function replace(location, data) {
	data = data || {};

	let route = setRoute(location);

	window.history.replaceState({
		route: route,
		parentRoute: parentRoute,
		data: data
	}, null, route);
}

function back() {
	window.history.back();
}

function forward() {
	window.history.forward();
}

function getRoute() {
	let route = '/';

	route += path.join('/');

	if(params) {
		queryString = '';

		for(let p in params) {
			queryString += '&'+p+'='+params[p];
		}

		route += '?'+queryString.substring(1);
	}

	return route;
}

function getPath() {
	return path;
}

function getParams() {
	return params;
}

function getState() {
	return history.state;
}

function onClick(e) {
	if(e.ctrlKey || e.metaKey || e.shiftKey || e.which == 2 || e.button == 2) return;

	let node = event.target || event.srcElement;

	while(node && node != document.body) {
		if(node.nodeName.toUpperCase() == 'A') {
			break;
		}
		node = node.parentNode;
	}

	if(node === document.body) return;

	let location = window.location,
		origin = String(location.protocol) + '//' + String(location.host),
		href = node.getAttribute('href') && node.getAttribute('href').replace(origin, ''),
		protocol = node.protocol;

	if(!node ||
		node.target == '_blank' ||
		node.target == '_self' ||
		node.hasAttribute('download') ||
		protocol.match('http') === null ||
		node.href.indexOf(location.host) == -1
	) return;

	if(location.href == origin+href) {
		e.preventDefault();
		return;
	}

	navigate(href, Object.assign({}, node.dataset));

	e.preventDefault();
}

function setState() {
	let location = window.location,
		origin = String(location.protocol) + '//' + String(location.host),
		href = String(location.href);

	return setRoute('/'+href.substring(origin.length));
}

function setRoute(href) {
	href = href.split('?');

	if(href[0].charAt(0) == '/') {
		path = href[0].split('/');
		while(path[0] == '') path.shift();
	}
	else {
		let append = href[0].split('/');
		while(append[0] == '') append.shift();

		path.pop();

		path = path.concat(append);
	}

	if(href.length > 1) {
		params = {};

		let arr = href[1].split('&');

		while(arr.length>0) {
			let param = arr.shift().split('=');
			params[param[0]] = param[1];
		}
	}
	else {
		params = undefined;
	}

	return getRoute();
}

function onChange(route, state) {
	EventSystem.broadcast(new CustomEvent('history:change', {detail: {
		route: route,
		state:state
	}}));
}

export default {init, navigate, replace, back, forward, getRoute, getPath, getParams, getState}