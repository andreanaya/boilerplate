import {register} from 'boilerplate/general/js/Factory.js';
import Gesture, {hasGestures} from 'boilerplate/general/js/Gesture';

export default class HorizontalScroll {
	constructor(el) {
		el.style.display = 'inline-block';
		el.style.textAlign = 'initial';


		this.el = document.createElement('div');
		this.el.style.overflowX = 'hidden';
		this.el.style.textAlign = 'center';

		el.parentNode.insertBefore(this.el, el);
		this.el.appendChild(el);

		this.container = el;

		this.el.enableGestures();

		window.addEventListener('resize', this.onResize = resize.bind(this));

		this.onResize();
	}
}

function onStart(e) {
	this.el.style.cursor = '-webkit-grabbing';
	this.anchor = e.screenX || e.detail.screenX;
	this.scrollPosition = this.el.scrollLeft;
	
	if(hasGestures(this.el)) {
		this.el.addEventListener(Gesture.TOUCH_MOVE, this.onMove = onMove.bind(this));
		this.el.addEventListener(Gesture.TOUCH_END, this.onEnd = onEnd.bind(this));
	} else {
		window.addEventListener('mousemove', this.onMove = onMove.bind(this));
		window.addEventListener('mouseup', this.onEnd = onEnd.bind(this));
	}

	e.preventDefault();
}
function onMove(e) {
	e.preventDefault();

	this.el.scrollLeft = this.scrollPosition + this.anchor - (e.screenX || e.detail.screenX);
	
}
function onEnd(e) {
	this.el.style.cursor = '-webkit-grab';
	this.anchor = undefined;

	if(hasGestures(this.el)) {
		this.el.removeEventListener(Gesture.TOUCH_MOVE, this.onMove);
		this.el.removeEventListener(Gesture.TOUCH_END, this.onEnd);
	} else {
		window.removeEventListener('mousemove', this.onMove);
		window.removeEventListener('mouseup', this.onEnd);
	}
}

function resize(e) {
	var isOverflow = this.container.scrollWidth > this.el.offsetWidth;
			
	if(isOverflow) {
		this.el.addEventListener(hasGestures(this.el) ? Gesture.TOUCH_START : 'mousedown', this.onStart = onStart.bind(this));

		this.el.style.cursor = '-webkit-grab';
	} else {
		this.el.removeEventListener(hasGestures(this.el) ? Gesture.TOUCH_START : 'mousedown', this.onStart);

		this.el.style.cursor = 'auto';
	}
}

register('horizontal-scroll', HorizontalScroll);