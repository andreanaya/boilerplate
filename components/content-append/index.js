import {register} from 'boilerplate/general/js/Factory.js';

export default class ContentAppend {
	constructor(el) {
		this.el = el;
		this.target = this.el.dataset.target;

		this.update();

		this.el.subscribe('content:loaded:'+this.target, (e) => {
			this.parse(e.detail.body);
            this.update();
		})
	}

	update() {
		[...this.el.querySelectorAll('a')].forEach((el) => {
			el.addEventListener('click', (e) => {
				el.broadcast(new CustomEvent('content:load:'+this.target, {
					detail: {
						url: el.href,
						type: 'append'
					}
				}))

				e.preventDefault();
			})
		})
	}

	parse(body) {
		let div = document.createElement('div');
        div.innerHTML = body;
        let el = div.querySelector('[data-component="content-append"][data-target="'+this.target+'"]');
        this.el.innerHTML = el?el.innerHTML:'';
	}
}

register('content-append', ContentAppend);