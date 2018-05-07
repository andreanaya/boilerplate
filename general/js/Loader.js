export default class Loader {
	constructor() {
		this.loader = new XMLHttpRequest();
		this.headers = [];
		this.responseType;

		this.loader.addEventListener('load', onLoad.bind(this));
	}

	addEventListener(type, callback) {
		this.loader.addEventListener(type, callback);
	}

	removeEventListener(type, callback) {
		this.loader.removeEventListener(type, callback);
	}

	setHeader(key, value) {
		this.headers.push({
			key: key,
			value: value
		});
	}

	load(url) {
		send.call(this, "GET", url);
	}

	post(url, params) {
		send.call(this, "POST", url, params);
	}

	submit(form) {
		send.call(this, form.method.toUpperCase(), form.action, new FormData(form));
	}

	abort() {
		this.loader.abort();
	}
}

function send(method, url, params) {
	this.loader.open(method, url, true);
	setProperties.call(this);
	this.loader.send(params);
}

function onLoad(e) {
	var data = this.loader.response;

	if (!data) {
		data = this.loader.responseText;
	}

	if(this.loader.status == 200 || this.loader.status == 304 || this.loader.status == 0) {
		this.loader.dispatchEvent(new CustomEvent('complete', {
			detail: data
		}));
	}
	else {
		this.loader.dispatchEvent(new CustomEvent('error'));
	}
}

function setProperties() {
	if(this.responseType) this.loader.responseType = this.responseType;

	this.headers.forEach(function(header) {
		this.loader.setRequestHeader(header.key, header.value);
	}, this);
}