import {register} from 'boilerplate/general/js/Factory.js';

export default class RichTable {
    constructor(el) {
        this.el = el;

        [...this.el.querySelectorAll('[type="submit"]')].forEach((button)=> {
        	button.addEventListener('click', (e) => {
        		let formData = new FormData(this.el);
        		formData.append(e.currentTarget.name, e.currentTarget.value)

				var object = {};

				for(var pair of formData) {
					processKey(object, pair[0], pair[1]);
				}

				console.log(object);

				e.preventDefault();
			})
        })
    }
}

function processKey(object, key, value) {
	var arr = key.split(/\[/).map((key => key.replace(/([a-zA-Z0-9])\]/igm, '$1').replace(/^\]/igm, '\[\]')));

	let ref = object;

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

register('rich-table', RichTable);