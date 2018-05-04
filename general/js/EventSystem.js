if ( typeof window.CustomEvent === "undefined" ) {
	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
}

let events = {};

const subscribe = function(type, callback) {
	if(events[type] === undefined) events[type] = [];
	events[type].push(callback);
}

const unsubscribe = function(type, callback) {
	events[type] = events[type].filter( cb => cb !== callback );
}

const broadcast = function(event) {
	if(events[event.type]) {
		events[event.type].forEach(callback => callback(event) );
	}

	Array.from(document.querySelectorAll('[data-dom-events~=\''+event.type+'\']')).forEach(function(el) {
		el.dispatchEvent(event);
	});
}

const addDOMEvent = function(type) {
	let events = (this.dataset.domEvents || '').split(' ').filter(event => event !== '');

	if(events.indexOf(type) === -1) {
		events.push(type);
		this.dataset.domEvents = events.join(' ');
	}
}

const removeDOMEvent = function(type) {
	let events = (this.dataset.domEvents || '').split(' ').filter(event => event !== '');

	if(events.indexOf(type) !== -1) {
		events = events.filter(function(type) { type !== this }, type);
		this.dataset.domEvents = events.join(' ');
	}
}

const onBlock = function(e) {
	if(e.eventPhase === Event.CAPTURING_PHASE) {
		e.currentTarget.dispatchEvent(new CustomEvent('block'));
		e.stopPropagation();
	}
}

const onPublish = function(e) {
	this.dispatchEvent(e.detail.event);
}

Element.prototype.subscribe = function(type, callback) {
	this.addEventListener(type, callback);
	addDOMEvent.call(this, type);
};

Element.prototype.unsubscribe = function(type, callback) {
	this.removeEventListener(type, callback);
	removeDOMEvent.call(this, type);
};

Element.prototype.block = function(type) {
	addDOMEvent.call(this, '!'+type);
};

Element.prototype.unblock = function(type) {
	removeDOMEvent.call(this, '!'+type);
};

Element.prototype.emit = function(event) {
	let elements = Array.from(this.querySelectorAll('[data-dom-events~=\''+event.type+'\']'));

	if(elements.length > 0) {
		let blockers = Array.from(this.querySelectorAll('[data-dom-events~=\'!'+event.type+'\']'));
		
		blockers.forEach(function(el) {
			el.addEventListener('publish', onBlock, true);
		});

		elements.forEach(function(el) {
			el.addEventListener('publish', onPublish);
			el.dispatchEvent(new CustomEvent('publish', {detail: {event:event}}));
			el.removeEventListener('publish', onPublish);
		});

		blockers.forEach(function(el) {
			el.removeEventListener('publish', onBlock, true);
		});
	}
}

Element.prototype.broadcast = broadcast;

export default {subscribe, unsubscribe, broadcast};