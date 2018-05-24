import {register} from 'boilerplate/general/js/Factory.js';

export default class DragList {
	constructor(el) {
		this.el = el;
		[...el.querySelectorAll('[data-item]')].forEach((item) => {
			let content = item.querySelector('[data-content');
			content.draggable = true;
			content.addEventListener('dragstart', onDragStart.bind(this));
			content.addEventListener('dragend', onDragEnd.bind(this));

			item.addEventListener('dragover', onDragOver);
			item.addEventListener('dragenter', onDragEnter);
			item.addEventListener('dragleave', onDragLeave);
			item.addEventListener('drop', onDrop);
		});
	}
}

function onDragStart(e) {
	let id = 'id-'+Date.now();
	let item = e.currentTarget.parentNode;
	let height = item.offsetHeight;

	item.setAttribute('data-item-id', id);
	e.dataTransfer.setData('item', id);

	let items = [...this.el.querySelectorAll('[data-item]')];

	let index = items.indexOf(e.currentTarget.parentNode);

	items.forEach((item, i) => {
		item.style.fontSize = height+'px';
		if(i < index) {
			item.classList.add('is-before');
		} else if(i > index) {
			item.classList.add('is-after');
		}
	})

	requestAnimationFrame(function() {
		this.classList.add('is-dragging');
	}.bind(this.el));
}

function onDragEnd(e) {
	e.currentTarget.parentNode.removeAttribute('data-item-id');
	this.el.classList.remove('is-dragging');

	[...this.el.querySelectorAll('[data-item]')].forEach((item) => {
		item.classList.remove('is-before', 'is-after');
	})
}


function onDragOver(e) {
	e.preventDefault();
}

function onDragEnter(e) {
	e.currentTarget.classList.add('is-over');
}

function onDragLeave(e) {
	e.currentTarget.classList.remove('is-over');
}

function onDrop(e) {
	let id = e.dataTransfer.getData('item');
	let item = document.querySelector('[data-item-id="'+id+'"]');

	let target = e.currentTarget;

	target.classList.remove('is-over');

	let items = [...target.parentNode.querySelectorAll('[data-item]')];

	if(items.indexOf(item) < items.indexOf(target)) {
		let next = target.nextElementSibling;
		
		if(next) {
			target.parentNode.insertBefore(item, next);
		} else {
			target.parentNode.append(item);
		}
	} else {
		target.parentNode.insertBefore(item, target);
	}

}

register('drag-list', DragList);