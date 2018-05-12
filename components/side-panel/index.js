import {register} from 'boilerplate/general/js/Factory.js';
import {TweenMax, Cubic} from 'gsap';

const map = new WeakMap();

export default class SidePanel {
	constructor(el) {
		this.el = el;

		this.el.style.width = '0';

		el.parentNode.insertBefore(this.el, el);

		this.panel = el.querySelector('[data-panel]');

		if(this.panel.dataset.position == 'left') {
			TweenMax.set(this.panel, { xPercent: '-100%' });
			map.set(this.el, true);
		} else {
			map.set(this.el, false);
		}

		this.onClick = function() {
			if(this.panel.classList.contains('.is-open')) {
				this.close();
			} else {
				this.open();
			}
		}.bind(this);

		if(el.id) {
			[...document.querySelectorAll('[data-control='+el.id+']')].forEach((control) => {
				control.addEventListener('click', this.onClick);
			});
		}
	}

	open() {
		TweenMax.to(this.panel, 0.5, {
			xPercent: this.panel.dataset.position == 'left'?'0':'-100%',
			ease: Cubic.easeOut,
			onComplete: () => {
				this.panel.classList.add('.is-open');
				map.set(this.el, false);
			}
		});
	}

	close() {
		TweenMax.to(this.panel, 0.5, {
			xPercent: this.panel.dataset.position == 'left'?'-100%':'0',
			ease: Cubic.easeOut,
			onComplete: () => {
				this.panel.classList.remove('.is-open');
				map.set(this.el, true);
			}
		});
	}
}

register('side-panel', SidePanel);