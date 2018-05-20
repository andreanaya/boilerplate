import {register} from 'boilerplate/general/js/Factory.js';
import {broadcast} from 'boilerplate/general/js/EventSystem.js';
import Loader from 'boilerplate/general/js/Loader.js';

const loader = new Loader();

let onComplete;

loader.addEventListener('complete', );

export default class Lightbox {
	constructor(el) {
		this.el = el;
		this.target = el.dataset.target;
		let target = document.querySelector('#'+this.target);

		let close = document.createElement('div');
		close.className = "close";
		close.addEventListener('click', (e) => {
			if(target) {
				target.unlock();
			}

			this.el.classList.remove('is-visible');
		})

		this.el.subscribe('lightbox:open:'+this.target, (e) => {

			loader.abort();

			if(onComplete) loader.removeEventListener('complete', onComplete);

			onComplete = (e) => {
				let response = e.detail;

				let body = /<body[^>]*>((.|[\n\r])*)<\/body>/im.exec(response)[1] || response;

				let div = document.createElement('div');
				div.innerHTML = body;
				let content = div.querySelector('#'+this.target);
				content.id = 'lighbox'+this.target;

				while(this.el.children.length>0) this.el.removeChild(this.el.children[0]);
				this.el.appendChild(content);
				this.el.appendChild(close);

				if(target) {
					target.lock();
				}

				this.el.classList.add('is-visible');
			}

			loader.addEventListener('complete', onComplete);

			loader.load(e.detail.url);
		});
	}
}

register('lightbox', Lightbox);