import {register} from 'boilerplate/general/js/Factory.js';

export default class DropdownMenu {
	constructor(el) {
		this.el = el;

		this.label = document.createElement('div');
		this.el.appendChild(this.label);

		this.items = this.el.querySelectorAll('[data-item]');

		this.list = document.createElement('div');
		this.list.style.position = 'absolute';

		this.current = 0;

		[...this.items].forEach((item, index) => {
			if(item.getAttribute('selected')) {
				this.current = index;
			}

			this.list.appendChild(item);
		});

		this.label.innerHTML = this.items[this.current].innerHTML;


		this.label.addEventListener('click', this.onClick = onOpen.bind(this));
	}

	getValue() {
		return this.items[this.current].dataset.item;
	}

	getLabel() {
		return this.label.innerHTML;
	}

	setValue(value) {
		let index = this.items.length;

		while(--index>-1) {
			if(this.items[index].dataset.item == value) {
				this.current = index;
				this.label.innerHTML = this.items[this.current].innerHTML;
				break;
			}
		}
	}
}

function onOpen(e) {
	this.label.removeEventListener('click', this.onClick);

	document.body.appendChild(this.list);

	let bounds = this.el.getBoundingClientRect();
	this.list.style.top = (bounds.bottom+pageYOffset)+'px';
	this.list.style.left = bounds.left+'px';
	this.list.style.width = Math.max(bounds.width, this.list.offsetWidth)+'px';

	window.addEventListener('click', this.onClick = onClose.bind(this));
	window.addEventListener('resize', this.onResize = onClose.bind(this));

	e.stopPropagation();
}


function onClose(e) {
	window.removeEventListener('click', this.onClick);
	window.removeEventListener('resize', this.onResize);
	
	if(e.target instanceof HTMLElement && this.list.contains(e.target)) {
		this.setValue(e.target.dataset.item);
	}

	document.body.removeChild(this.list);
	
	this.list.style.top = '';
	this.list.style.left = '';
	this.list.style.width = '';

	this.label.addEventListener('click', this.onClick = onOpen.bind(this));

	e.stopPropagation();
}

register('dropdown-menu', DropdownMenu);