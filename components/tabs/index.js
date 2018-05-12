import {register} from 'boilerplate/general/js/Factory.js';

export default class Tabs {
	constructor(el) {
		this.el = el;

		this.onClick = onClick.bind(this);

		this.tabs = [];

		[...el.querySelectorAll('[data-button]')].forEach((button) => {
			let id = button.getAttribute('href');
			let tab = this.el.querySelector(id);
			
			if(tab) {
				this.tabs.push({
					id: id,
					tab: tab,
					button: button
				});

				button.addEventListener('click', this.onClick);
			}
		});

		let active = el.getAttribute('data-active');

		if(active) {
			this.setTab('#'+active);
		} else {
			this.setTab(this.tabs[0].id);
		}
	}

	setTab(id) {
		this.tabs.forEach(setClass, id);	
	}
}

function setClass(item) {
	if(item.id === this) {
		item.tab.classList.add('is-active');
		item.button.classList.add('is-active');
	} else {
		item.tab.classList.remove('is-active');
		item.button.classList.remove('is-active');
	}
}

function onClick(e) {
	e.preventDefault();
	e.stopPropagation();

	this.setTab(e.target.getAttribute('href'));
}

register('tabs', Tabs);