import {subscribe} from 'boilerplate/general/js/EventSystem.js';

var map = new WeakMap(), current;

class Bounds {
	constructor(el) {
		var top = el.offsetTop;
		var left = el.offsetLeft;
		var width = el.offsetWidth;
		var height = el.offsetHeight;

		var parent = el.parentNode;

		while(parent != document.body) {
			top += parent.offsetTop;
			left += parent.offsetLeft;

			parent = parent.parentNode;
		}

		this.top = top;
		this.bottom = top+height;
		this.left = left;
		this.right = left+width;
		this.width = width;
		this.height = height;

		this.onScreen = pageYOffset < this.bottom && this.top < pageYOffset+window.innerHeight;
	}
}

var style = document.createElement("style");
style.appendChild(document.createTextNode(""));
document.head.appendChild(style);

style.sheet.insertRule(".is-locked { overflow: hidden; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; }", 0);

Element.prototype.lock = function() {
	var scrollTop = pageYOffset;
	this.classList.add('is-locked');
	this.scrollTop = scrollTop;
}

Element.prototype.unlock = function() {
	if(current && current !== this) {
		current.lock();
	}

	var scrollTop = this.scrollTop;
	this.classList.remove('is-locked');

	document.documentElement.scrollTop = scrollTop;
	document.body.scrollTop = scrollTop;

	current = this;
}

Element.prototype.track = function() {
	if(map.has(this)) return;
	
	this.subscribe('resize', onResize);
	this.subscribe('scroll', onScroll);
}

Element.prototype.untrack = function() {
	map.delete(this);

	this.unsubscribe('resize', onResize);
	this.unsubscribe('scroll', onScroll);
}

function checkPosition(min, max, speed) {
	let bounds = map.get(this);
	var onScreen = min < bounds.bottom && bounds.top < max;
	
	if(bounds.onScreen && !onScreen) {
		this.dispatchEvent(new CustomEvent('leaveScreen'));
	} else if(!bounds.onScreen && onScreen) {
		this.dispatchEvent(new CustomEvent('enterScreen'));
	}

	if(onScreen) {
		this.dispatchEvent(new CustomEvent('positionUpdate', {
			detail: {
				amount: (max-bounds.top)/(max-bounds.top-min+bounds.bottom),
				speed: speed
			}
		}));
	}

	bounds.onScreen = onScreen;
}

function setPosition() {
	let bounds = map.get(this);
	
	var rect = this.getBoundingClientRect();
	bounds.top = rect.top+pageYOffset;
	bounds.bottom = rect.bottom+pageYOffset;
}

function onScroll(e) {
	if(!map.has(this)) map.set(this, new Bounds(this));
	
	checkPosition.call(this, pageYOffset, pageYOffset+window.innerHeight, e.detail.speed);
}

function onResize(e) {
	if(!map.has(this)) map.set(this, new Bounds(this));

	setPosition.call(this);
	checkPosition.call(this, pageYOffset, pageYOffset+window.innerHeight, 0);
}