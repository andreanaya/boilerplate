import {subscribe} from 'boilerplate/general/js/EventSystem.js';

const prefix = 'cp';

let components = {};
let map = new WeakMap();

export function register(name, Component) {
	if(components.name !== undefined) return;
	components[name] = Component;
}

subscribe('app:init', () => {
	[...document.querySelectorAll('[data-component]')].forEach( (el) => {
		if(components[el.dataset.component] !== undefined && !map.has(el)) {
	    	map.set(el, new components[el.dataset.component](el));
		}
	});
});