import {register} from 'boilerplate/general/js/Factory.js';
import {jsonAttribute} from 'boilerplate/general/js/Utils.js';

export default class RichTable {
	constructor(el) {
		this.el = el;
		this.form = this.el.querySelector('form');
		this.table = this.el.querySelector('tbody');

		this.onClick = onClick.bind(this);

		[...this.el.querySelectorAll('[type="submit"]')].forEach((button)=> {
			button.addEventListener('click', this.onClick);
		});

		this.sort = this.table.dataset.sort? JSON.parse(jsonAttribute(this.table.dataset.sort)) : undefined;

		this.data = [...this.table.querySelectorAll('[data-row]')].map((row) => {
			return [...row.querySelectorAll('[data-col]')].reduce((data, el) => {
				if(this.sort === undefined) {
					this.sort = {};
					this.sort[el.dataset.key] = true;
				}

				data[el.dataset.key] = el.dataset.value;
				return data;
			}, {el: row});
		});
	}

	render(query) {
		if(query.sort) {
			this.sort = query.sort;
		}

		var key = Object.keys(this.sort).pop();
		var order = this.sort[key].toString() === 'true';

		this.data.sort(function(a, b) {
			if(a[key] > b[key]) {
				return order?1:-1;
			} else if(a[key] < b[key]) {
				return order?-1:1;
			} else {
				return 0;
			}
		}).forEach((item) => {
			let keys = Object.keys(query.filter || []);

			if(query.filter === undefined || keys.filter((key) => {
				return query.filter[key].indexOf(item[key]) > -1;
			}).length == keys.length) {
				item.el.classList.remove('is-hidden');
			} else {
				item.el.classList.add('is-hidden');
			}

			// return options.inverse(this);
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
	let filter = {};

	[...this.el.querySelectorAll('option')].forEach((option) => {
		if(option.selected) processKey(filter, option.parentNode.name, option.value);
	})

	processKey(filter, e.currentTarget.name, e.currentTarget.value);

	this.render(filter);
	
	e.preventDefault();
}

register('rich-table', RichTable);