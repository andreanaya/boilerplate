import {register} from 'boilerplate/general/js/Factory.js';
import Gesture, {hasGestures} from 'boilerplate/general/js/Gesture';
import {TweenLite, Cubic} from 'gsap';

export default class Slider {
	constructor(el) {
		this.el = el;
		this.container = el.querySelector('[data-container]');
		this.prev = el.querySelector('[data-prev');
		this.next = el.querySelector('[data-next');

		this.pos = 0;

		this.onPrev = onPrev.bind(this);
		this.onNext = onNext.bind(this);

		this.prev.addEventListener('click', this.onPrev);
		this.next.addEventListener('click', this.onNext);

		this.el.enableGestures();

		if(hasGestures(this.el)) {
			this.el.addEventListener(Gesture.SWIPE_RIGHT, this.onPrev)
			this.el.addEventListener(Gesture.SWIPE_LEFT, this.onNext)
		}

		window.addEventListener('resize', this.onResize = onResize.bind(this));

		this.onResize();
	}
}

function onPrev() {
	let slide = this.slides.filter((slide) => {
		return this.pos+slide.right>0;
	}).shift();

	if(slide) {
		this.pos = this.width-slide.right;

		if(this.pos > 0) {
			this.pos = 0;
		}

		TweenLite.to(this.container, 0.5, 	{
			x: this.pos,
			ease: Cubic.easeInOut
		});
	}
}

function onNext() {
	let slide = this.slides.filter((slide) => {
		return this.pos+slide.right>this.width;
	}).shift();

	if(slide) {
		this.pos = -slide.left;

		if(this.pos<this.width-this.container.scrollWidth) {
			this.pos = this.width-this.container.scrollWidth;
		}

		TweenLite.to(this.container, 0.5, 	{
			x: this.pos,
			ease: Cubic.easeInOut
		});
	}
}

function onResize(e) {
	this.slides = [...this.el.querySelectorAll('[data-slide]')].map((el) => {
		let left = el.offsetLeft;
		let right = left+el.offsetWidth;
		
		return {
			el: el,
			left: left,
			right: right
		};
	});

	this.width = this.el.offsetWidth;
}

register('slider', Slider);