import {register} from 'boilerplate/general/js/Factory.js';

const map = new WeakMap();

export default class LazyImage {
	constructor(el) {
		this.el = el;

		this.el.subscribe('app:show', () => {
			this.el.src = this.el.dataset.src;
		})
	}
}

register('lazy-image', LazyImage);