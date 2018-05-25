import {register} from 'boilerplate/general/js/Factory.js';
import {jsonAttribute} from 'boilerplate/general/js/Utils.js';

export default class RichTable {
	constructor(el) {
		this.el = el;
		this.table = this.el.querySelector('tbody');

		this.onClick = onClick.bind(this);

		[...this.el.querySelectorAll('[type="checkbox"], [type="radio"]')].forEach((button)=> {
			button.addEventListener('click', this.onClick);
		});

		this.sort = this.el.dataset.sort? this.el.dataset.sort === 'true' : undefined;
		this.descending = this.el.dataset.descending ? true : false;

		this.data = [...this.table.querySelectorAll('[data-row]')].map((row) => {
			return [...row.querySelectorAll('[data-col]')].reduce((data, el) => {
				if(this.sort === undefined) {
					this.sort = el.dataset.key;
				}

				data[el.dataset.key] = el.dataset.value;
				return data;
			}, {el: row});
		});
	}

	render(query) {
		if(query.sort) {
			this.sort = query.sort;
			this.descending = query[query.sort] === 'true';
		}

		this.data.sort((a, b) => {
			if(a[this.sort] > b[this.sort]) {
				return this.descending?-1:1;
			} else if(a[this.sort] < b[this.sort]) {
				return this.descending?1:-1;
			} else {
				return 0;
			}
		}).forEach((item) => {
			let keys = Object.keys(query.filter || {});

			let filter = true;

			if(this.el.dataset.filter === 'every') {
				filter = keys.filter((key) => {
					return query.filter[key].indexOf(item[key]) > -1;
				}).length == keys.length;
			} else {
				filter = keys.filter((key) => {
					return query.filter[key].indexOf(item[key]) > -1;
				}).length > 0;
			}

			if(filter) {
				item.el.classList.remove('is-hidden');
			} else {
				item.el.classList.add('is-hidden');
			}

			this.table.appendChild(item.el);
		})
	}
}

function processKey(data, key, value) {
	var arr = key.split(/\[/).map((key => key.replace(/([a-zA-Z0-9])\]/igm, '$1').replace(/^\]/igm, '\[\]')));
	
	let ref = data;

	if(arr[arr.length-1] == '[]') {
		arr.pop();
		value = [value];
	}

	
	arr.forEach((item, index, arr) => {
		if(index<arr.length-1) {
			if(ref[item] === undefined) {
				ref[item] = {};
			}

			ref = ref[item];
		} else {
			if(Array.isArray(ref[item])) {
				ref[item] = ref[item].concat(value);
			} else {
				if(ref[item] === undefined) {
					ref[item] = value;
				} else {
					ref[item] = [ref[item], value];
				}
			}
		}
	});
}

function onClick(e) {
	let query = {};

	[...this.el.querySelectorAll('[type="checkbox"], [type="radio"]')].forEach((filter) => {
		if(filter.checked) processKey(query, filter.name, filter.value);
	})

	this.render(query);
}

register('rich-table', RichTable);