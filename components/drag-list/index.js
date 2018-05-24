import {register} from 'boilerplate/general/js/Factory.js';

export default class DragList {
	constructor(el) {
		this.el = el;

		this.onDragStart = onDragStart.bind(this);
		this.onDragEnd = onDragEnd.bind(this);
		this.onDragOver = onDragOver.bind(this);
		this.onDragEnter = onDragEnter.bind(this);
		this.onDragLeave = onDragLeave.bind(this);
		this.onDrop = onDrop.bind(this);

		this.items = [...this.el.querySelectorAll('[data-item]')];

		this.items.forEach((item) => {
			let content = item.querySelector('[data-content');
			content.draggable = true;
			content.addEventListener('dragstart', this.onDragStart);
			content.addEventListener('dragend', this.onDragEnd);

			item.addEventListener('dragover', this.onDragOver);
			item.addEventListener('dragenter', this.onDragEnter);
			item.addEventListener('dragleave', this.onDragLeave);
			item.addEventListener('drop', this.onDrop);
		});
	}

	dragStart() {
		this.current = this.el.querySelector('[data-item="current"]');
		this.offsetHeight = this.current.offsetHeight;
		this.index = this.items.indexOf(this.current);
	}

	dragOver(el) {
		let index = this.items.indexOf(el);

		this.items.forEach((item, i) => {
			if(index < this.index && i >= index && i < this.index) {
				item.firstElementChild.style.transform = 'translateY('+(this.offsetHeight)+'px)';
			} else if(index > this.index && i > this.index && i <= index) {
				item.firstElementChild.style.transform = 'translateY(-'+(this.offsetHeight)+'px)';
			} else {
				item.firstElementChild.style.transform = '';
			}
		});
	}

	dragOut() {
		console.log('out')
		this.items.forEach((item, i) => {
			item.firstElementChild.style.transform = '';
		});
	}

	dragEnd() {
		this.items.forEach((item, i) => {
			item.firstElementChild.style.transform = '';
		});
	}
}

function onDragStart(e) {
	e.currentTarget.parentNode.dataset.item = 'current';

	requestAnimationFrame(() => {
		this.el.classList.add('is-dragging');
		this.dragStart();
	});
}

function onDragEnd(e) {
	this.el.classList.remove('is-dragging');

	this.items.forEach((el) => {
		el.dataset.item = '';
	})

	this.dragEnd();
}


function onDragOver(e) {
	e.preventDefault();
}

function onDragEnter(e) {
	if(e.currentTarget.dataset.item != 'current') {
		e.currentTarget.dataset.item = 'over';
	}

	let list = this.el.querySelectorAll('[data-item="over"]');
	if(list.length == 1) this.dragOver(list[0]);
}

function onDragLeave(e) {
	if(e.currentTarget.dataset.item != 'current') {
		e.currentTarget.dataset.item = '';
	}

	
	let list = this.el.querySelectorAll('[data-item="over"]');
	if(list.length == 1) this.dragOver(list[0]);
	if(list.length == 0) this.dragOut();
}

function onDrop(e) {
	let item = this.el.querySelector('[data-item="current"]');

	let target = e.currentTarget;

	target.dataset.item = "over";

	if(this.items.indexOf(item) < this.items.indexOf(target)) {
		let next = target.nextElementSibling;
		
		if(next) {
			target.parentNode.insertBefore(item, next);
		} else {
			target.parentNode.append(item);
		}
	} else {
		target.parentNode.insertBefore(item, target);
	}

	this.items = [...this.el.querySelectorAll('[data-item]')];
}

register('drag-list', DragList);