import {register} from 'boilerplate/general/js/Factory.js';

export default class ContentPagination {
	constructor(el) {
		this.el = el;
		this.target = this.el.dataset.target;

		this.update();

		this.el.subscribe('content:loaded:'+this.target, (e) => {
			let div = document.createElement('div');
            div.innerHTML = e.detail.body;
            this.el.innerHTML = div.querySelector('[data-component="content-pagination"][data-target="'+this.target+'"]').innerHTML;

            this.update();
		})
	}

	update() {
		[...this.el.querySelectorAll('a')].forEach((el) => {
			el.addEventListener('click', (e) => {
				el.broadcast(new CustomEvent('content:load:'+this.target, {
					detail: {
						url: el.href,
						type: 'replace'
					}
				}))

				e.preventDefault();
			})
		})
	}
}

register('content-pagination', ContentPagination);