var map = new WeakMap(), init = false, current;

function Bounds(el) {
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

function lock() {
	var scrollTop = pageYOffset;
	this.classList.add('is-locked');
	this.scrollTop = scrollTop;
}

function unlock() {
	if(current && current !== this) {
		current.lock();
	}

	var scrollTop = this.scrollTop;
	this.classList.remove('is-locked');

	document.documentElement.scrollTop = scrollTop;
	document.body.scrollTop = scrollTop;

	current = this;
}

function track() {
	if(map.has(this)) return;
	
	map.set(this, new Bounds(this))

	this.subscribe('resize', onResize);
	this.subscribe('scroll', onScroll);
}

function untrack() {
	if(map.has(this)) return;
	
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
	checkPosition.call(this, pageYOffset, pageYOffset+window.innerHeight, e.detail.speed);
}

function onResize(e) {
	setPosition.call(this);
	checkPosition.call(this, pageYOffset, pageYOffset+window.innerHeight, 0);
}

module.exports = {
	init: function() {
		if(init) return;

		var style = document.createElement("style");
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);

		style.sheet.insertRule(".is-locked { overflow: hidden; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; }", 0);

		Element.prototype.lock = lock;
		Element.prototype.unlock = unlock;
		Element.prototype.track = track;
		Element.prototype.untrack = untrack;
	}
}