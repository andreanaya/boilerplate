import {register} from 'boilerplate/general/js/Factory.js';
import Gesture, {hasGestures} from 'boilerplate/general/js/Gesture.js';

export default class Slideshow {
	constructor(el) {
		this.el = el;

		let containers = el.querySelectorAll('[data-container]');
		let bullets = el.querySelectorAll('[data-bullet]');

		this.slides = [];
		this.bullets = [];

		[...containers].forEach(parseContainer, this);

		this.onBullet = onBullet.bind(this);
		[...bullets].forEach(parseBullet, this);

		let prev = el.querySelector('[data-prev]');
		let next = el.querySelector('[data-next]');

		if(prev) {
			prev.addEventListener('click', this.onArrowPrev = () => {
				this.prev();
			});
		}

		if(next) {
			next.addEventListener('click', this.onArrowNext = () => {
				this.next();
			});
		}

		this.current = parseInt(el.getAttribute('data-current')) || 0;
		this.total = this.slides.length;

		this.slides[this.current].forEach(setActive);
		this.bullets[this.current].classList.add('is-active');


		this.touchArea = this.el.querySelector('[data-touch-area]');

		if(this.touchArea) {
			this.touchArea.enableGestures();

			if(hasGestures(this.touchArea)) {
				this.touchArea.addEventListener(Gesture.TOUCH_START, this.onTouchStart = onTouchStart.bind(this));
				this.touchArea.addEventListener(Gesture.TAP, this.onTap = onTap.bind(this));
				this.touchArea.addEventListener(Gesture.SWIPE_LEFT, this.onSwipeLeft = onSwipeLeft.bind(this));
				this.touchArea.addEventListener(Gesture.SWIPE_RIGHT, this.onSwipeRight = onSwipeRight.bind(this));
				this.touchArea.addEventListener(Gesture.CANCEL, this.onCancel = onCancel.bind(this));
			}
		}

		let interval = parseInt(el.dataset.interval);
		let toggle = el.querySelector('[data-toggle]');

		if(interval != undefined) {
			this.autoPlay(interval*1000>>0);

			if(toggle) {
				toggle.classList.add('is-active');
			}
		}

		if(toggle) {
			toggle.addEventListener('click', (e) => {
				if(toggle.classList.toggle('is-active')) {
					this.autoPlay(interval? (interval*1000>>0) : 5000);
				} else {
					this.stop();
				}
			});
		}
	}

	setSlide(index) {
		if(this.block) return;

		this.block = true;

		if(index < 0 || index > this.total-1) return;

		let current = this.slides[this.current];
		let next = this.slides[index];

		this.current = index;

		this.onSetSlide(current, next);
	}

	prev() {
		if(this.block) return;

		this.block = true;

		let index = (this.current-1+this.total)%this.total;

		let current = this.slides[this.current];
		let prev = this.slides[index];

		this.current = index;

		this.onPrev(current, prev);
	}

	next() {
		if(this.block) return;

		this.block = true;

		let index = (this.current+1+this.total)%this.total;

		let current = this.slides[this.current];
		let next = this.slides[index];

		this.current = index;

		this.onNext(current, next);
	}

	autoPlay(interval) {
		this.interval = interval;
		this.id = setInterval(() => {
			this.setSlide((this.current+1)%this.total);
		}, interval);
	}

	stop() {
		clearInterval(this.id);
	}

	onSetSlide(slideOut, slideIn) {
		this.onChange();
	}

	onPrev(slideOut, slideIn) {
		this.onChange();
	}

	onNext(slideOut, slideIn) {
		this.onChange();
	}

	onSnapPrev(slideOut, slideIn, amount) {
		this.onChange();
	}

	onSnapNext(slideOut, slideIn, amount) {
		this.onChange();
	}

	onSnapCurrent(slideOut, slideIn, amount) {
		this.onChange();
	}

	onPan(amount) {
	}

	onChange() {
		this.block = false;

		this.slides.forEach(setSlide, this);
		this.bullets.forEach(setBullet, this);
		this.el.classList.remove('is-dragging');
	}
}


function parseBullet(bullet) {
	this.bullets.push(bullet);

	bullet.addEventListener('click', this.onBullet);
}

function parseContainer(container) {
	let slides = container.querySelectorAll('[data-slide]');

	Array.prototype.forEach.call(slides, parseSlide, this);
}

function parseSlide(slide, index) {
	if(this.slides[index] === undefined) {
		this.slides[index] = [];
	}

	this.slides[index].push(slide);
}

function setBullet(bullet, index) {
	if(index === this.current) {
		bullet.classList.add('is-active');
	} else {
		bullet.classList.remove('is-active');
	}
}

function setSlide(slide, index) {
	if(index === this.current) {
		slide.forEach(setActive);
	} else {
		slide.forEach(setInactive);
	}
}

function setActive(item) {
	item.classList.add('is-active');
}

function setInactive(item) {
	item.classList.remove('is-active');
}

function onBullet(e) {
	this.setSlide(this.bullets.indexOf(e.target));
}

function onTouchStart(e) {
	if(this.block) return;

	this.block = true;

	this.anchor = e.detail.screenX;
	this.width = this.touchArea.offsetWidth;

	this.touchArea.addEventListener(Gesture.TOUCH_MOVE, this.onTouchMove = onTouchMove.bind(this));
	this.touchArea.addEventListener(Gesture.TOUCH_END, this.onTouchEnd = onTouchEnd.bind(this));

	this.el.classList.add('is-dragging');
}

function onTouchMove(e) {
	var amount = (e.detail.screenX - this.anchor) / this.width;

	if(amount < -1) amount = -1;
	if(amount > 1) amount = 1;

	this.onPan(amount)
}

function onTouchEnd(e) {
	var amount = (e.detail.screenX - this.anchor) / this.width;

	var currentSlide = this.slides[this.current];

	if(amount < -0.1) {
		this.current = (this.current+1+this.total)%this.total;

		this.onSnapNext(currentSlide, this.slides[this.current], amount);
	} else if(amount > 0.1) {
		this.current = (this.current-1+this.total)%this.total;

		this.onSnapPrev(currentSlide, this.slides[this.current], amount);
	} else {
		this.onSnapCurrent(this.slides[(this.current+(amount < 0 ? 1 : -1)+this.total)%this.total], currentSlide, amount);
	}

	this.touchArea.removeEventListener(Gesture.TOUCH_MOVE, this.onTouchMove);
	this.touchArea.removeEventListener(Gesture.TOUCH_END, this.onTouchEnd);
}

function onSwipeLeft(e) {
	var currentSlide = this.slides[this.current];

	this.current++;
	if(this.current == this.total) this.current = 0;

	this.touchArea.removeEventListener(Gesture.TOUCH_MOVE, this.onTouchMove);
	this.touchArea.removeEventListener(Gesture.TOUCH_END, this.onTouchEnd);

	var amount = (e.detail.screenX - this.anchor) / this.width;

	this.onSnapNext(currentSlide, this.slides[this.current], amount);
}

function onSwipeRight(e) {
	var currentSlide = this.slides[this.current];
	
	if(this.current == 0) this.current = this.total;
	this.current--;

	this.touchArea.removeEventListener(Gesture.TOUCH_MOVE, this.onTouchMove);
	this.touchArea.removeEventListener(Gesture.TOUCH_END, this.onTouchEnd);

	var amount = (e.detail.screenX - this.anchor) / this.width;

	this.onSnapPrev(currentSlide, this.slides[this.current], amount);
}

function onTap(e) {
	this.block = false;

	this.touchArea.removeEventListener(Gesture.TOUCH_MOVE, this.onTouchMove);
	this.touchArea.removeEventListener(Gesture.TOUCH_END, this.onTouchEnd);

	this.el.classList.remove('is-dragging');
}

function onCancel() {
	this.block = false;

	this.touchArea.removeEventListener(Gesture.TOUCH_MOVE, this.onTouchMove);
	this.touchArea.removeEventListener(Gesture.TOUCH_END, this.onTouchEnd);

	this.el.classList.remove('is-dragging');
}

register('slideshow', Slideshow);