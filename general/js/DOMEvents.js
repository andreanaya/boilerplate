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

Element.prototype.publish = function(event) {
	let elements = Array.from(this.querySelectorAll('[data-dom-events~=\''+event.type+'\']'));

	if(elements.length > 0) {
		let blockers = Array.from(this.querySelectorAll('[data-dom-events~=\'!'+event.type+'\']'));
		
		blockers.forEach((el) => {
			el.addEventListener('publish', onBlock, true);
		});

		elements.forEach((el) => {
			el.addEventListener('publish', onPublish);
			el.dispatchEvent(new CustomEvent('publish', {detail: {event:event}}));
			el.removeEventListener('publish', onPublish);
		});

		blockers.forEach((el) => {
			el.removeEventListener('publish', onBlock, true);
		});
	}
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
		e.stopPropagation();
	}
}

const onPublish = function(e) {
	this.dispatchEvent(e.detail.event);
}