import {register} from 'boilerplate/general/js/Factory.js';
import Loader from 'boilerplate/general/js/Loader.js';

export default class ContentArea {
	constructor(el) {
		this.el = el;
		this.id = el.id;
		this.type = '';

		this.loader = new Loader();

        this.loader.addEventListener('complete', (e) => {
            let response = e.detail;

            let body = /<body[^>]*>((.|[\n\r])*)<\/body>/im.exec(response)[1] || response;

            let div = document.createElement('div');
            div.innerHTML = body;

            let html = div.querySelector('#'+this.id).innerHTML;

            if(this.type == 'replace') {
            	this.el.innerHTML = html;
            } else if(this.type == 'append') {
            	this.el.insertAdjacentHTML('beforeend', html);
            }
            

            this.el.broadcast(new CustomEvent('content:loaded:'+this.id, {
				detail: {
					body: body
				}
			}));
        });

		this.el.subscribe('content:load:'+this.id, (e) => {
			this.loader.abort();
			this.loader.load(e.detail.url);
			this.type = e.detail.type;
		})
	}
}

register('content-area', ContentArea);