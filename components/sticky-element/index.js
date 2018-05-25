import {subscribe} from 'boilerplate/general/js/EventSystem.js';
import {register} from 'boilerplate/general/js/Factory.js';

let map = new WeakMap();

export default class StickyElement {
	constructor(el) {
		let parent = el.parentNode;

		while(parent != document.body) {
			if(parent.dataset.stickyContainer != undefined) {
				break;
			}

			parent = parent.parentNode;
		}

		parent.style.position = 'relative';

		let placeholder = document.createElement('div');
		placeholder.style.display = 'none';

		placeholder.setAttribute('class', el.getAttribute('class'));

		parent.insertBefore(placeholder, el);

		let bounds = el.getBoundingClientRect();

		let marginTop = parseInt(el.dataset.stickyTop) || 0;
		let marginBottom = parseInt(el.dataset.stickyBottom) || 0;

		if(!map.has(parent)) {
			map.set(parent, []);
			parent.subscribe('scroll', onScroll);
			parent.subscribe('resize', onResize);
		}

		map.get(parent).push({
			el: el,
			parent: parent,
			placeholder: placeholder,
			bounds: {
				top: bounds.top+pageYOffset,
				bottom: bounds.bottom+pageYOffset,
				left: bounds.left,
				right: bounds.right,
				width: bounds.width,
				height: bounds.height
			},
			marginTop: marginTop,
			marginBottom: marginBottom,
			offset: 0,
		});
	}
}

function resizeItems(item) {
	item.placeholder.style.display = 'none';

	item.el.style.position = '';
	item.el.style.top = '';
	item.el.style.bottom = '';
	item.el.style.left = '';
	item.el.style.width = '';
	item.el.style.marginTop = '';
	item.el.style.zIndex = '';

	let bounds = item.el.getBoundingClientRect();

	item.bounds = {
		top: bounds.top+pageYOffset,
		bottom: bounds.bottom+pageYOffset,
		left: bounds.left,
		right: bounds.right,
		width: bounds.width,
		height: bounds.height
	};

	item.offset = 0;
}

function sortItems(a, b) {
	return a.bounds.top > b.bounds.top;
}

function mapItems(item, index, list) {
	let next = list[index+1];
	
	let marginBottom = parseInt(item.el.getAttribute('data-sticky-bottom')) || 0;

	if(next) {
		item.bottom = next.bounds.top - item.bounds.height - item.marginTop - marginBottom;
		item.pos = next.el.offsetTop - item.bounds.height - marginBottom;
	} else {
		let bounds = item.parent.getBoundingClientRect();
		
		item.disabled = bounds.height<=item.bounds.height;
		
		let paddingBottom = parseInt(window.getComputedStyle(item.parent, null).getPropertyValue('padding-bottom'));

		item.bottom = bounds.bottom + pageYOffset - item.bounds.height - item.marginTop - Math.max(marginBottom, paddingBottom);
		item.pos = bounds.height - item.bounds.height - Math.max(marginBottom, paddingBottom);
	}
}

function check(item, speed) {
	let pageYOffset = window.pageYOffset;

	if(item.disabled) pageYOffset = 0;

	let diff = Math.max(item.bounds.height-window.innerHeight, 0);

	if(diff > 0) {
		item.offset -= speed;

		if(item.offset < -diff) item.offset = -diff;
		if(item.offset > 0) item.offset = 0;
	}

	if(pageYOffset > item.bottom-item.offset) {
		item.el.style.position = 'absolute';
		item.el.style.top = item.pos+'px';
		item.el.style.left = '';
		item.el.style.width = item.bounds.width+'px';
		item.el.style.marginTop = '0';
		item.el.style.zIndex = '1';
	} else if(pageYOffset > item.bounds.top-item.marginTop) {
		item.el.style.position = 'fixed';
		item.el.style.top = item.offset+'px';
		item.el.style.bottom = '';
		item.el.style.left = item.bounds.left+'px';
		item.el.style.width = item.bounds.width+'px';
		item.el.style.marginTop = item.marginTop+'px';
		item.el.style.zIndex = '1';

		item.placeholder.style.display = 'block';
		item.placeholder.style.width = item.bounds.width+'px';
		item.placeholder.style.height = item.bounds.height+'px';
	} else {
		item.placeholder.style.display = 'none';

		item.el.style.position = '';
		item.el.style.top = '';
		item.el.style.bottom = '';
		item.el.style.left = '';
		item.el.style.width = '';
		item.el.style.marginTop = '';
		item.el.style.marginBottom = '';
		item.el.style.zIndex = '';
	}
}

function onScroll(e) {
	let elements = map.get(e.currentTarget);
	
	elements.forEach((item) => check(item, e.detail.speed));
}

function onResize(e) {
	let elements = map.get(e.currentTarget);
	
	elements.forEach(resizeItems);
	elements.sort(sortItems);
	elements.forEach(mapItems);

	elements.forEach((item) => check(item, 0));
}

register('sticky-element', StickyElement);