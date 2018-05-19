import {register} from 'boilerplate/general/js/Factory.js';

export default class ContentFilter {
	constructor(el) {
		this.el = el;
		this.target = this.el.dataset.target;

		this.el.addEventListener('submit', (e) => {
			let query = [];

			for(var pair of new FormData(this.el).entries()) {
				query.push(pair[0]+'='+encodeURIComponent(pair[1]));
			}

			this.el.broadcast(new CustomEvent('content:load:'+this.target, {
				detail: {
					url: this.el.action+'?'+query.join('&'),
					type: 'replace'
				}
			}))
			e.preventDefault();
		})

		this.el.subscribe('content:loaded:'+this.target, (e) => {
			this.parse(e.detail.body);
		});
	}

	parse(body) {
		let div = document.createElement('div');
		div.innerHTML = body;
		let el = div.querySelector('[data-component="content-filter"][data-target="'+this.target+'"]');
		this.el.innerHTML = el?el.innerHTML:'';
	}
}

register('content-filter', ContentFilter);