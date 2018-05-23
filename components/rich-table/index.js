import {register} from 'boilerplate/general/js/Factory.js';

export default class Accordion {
	constructor(el) {
		let button = el.querySelector('[data-button]');

		if(button === undefined) return;

		this.el = el;
		this.el.block('app:show');

		this.content = this.el.querySelector('[data-content]');
		this.button = button;

		this.group = el.dataset.group;
		
		button.addEventListener('click', this.onClick = onClick.bind(this));
	}
}

function onClick(e) {
	e.preventDefault();
	e.stopPropagation();

	this.el.classList.toggle('is-open');

	if(this.el.classList.contains('is-open')) {
		this.el.emit(new CustomEvent('app:show'));
	}

	if(this.group && this.group !== '') {
		var group = document.querySelectorAll('[data-component=accordion][data-group='+this.group+']');

		[...group].forEach(closeGroup, this.el);
	}
}

function closeGroup(accordion) {
	if(accordion !== this) {
		accordion.classList.remove('is-open');
	}
}

register('accordion', Accordion);