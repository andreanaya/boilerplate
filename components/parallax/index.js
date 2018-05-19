import {register} from 'boilerplate/general/js/Factory.js';

export default class Parallax {
	constructor(el) {
		this.el = el;
		
		this.el.track();

		this.type = this.el.dataset.type;

		if(this.type == 'trigger') {
			this.el.addEventListener('enterScreen', (e) => {
	            this.el.classList.add('on-screen');
	        });
	        this.el.addEventListener('leaveScreen', (e) => {
	            this.el.classList.remove('on-screen');
	        });
		} else if(this.type == 'parallax') {
			this.update = interpolateFunction(this.el);
			
			this.el.addEventListener('positionUpdate', (e) => {
	            this.el.style.cssText = this.update(e.detail.amount);
	        });
		}
	}

}

function interpolateFunction(el) {
	var start, end;
	
	start = el.dataset.parallaxStart;
	end = el.dataset.parallaxEnd;

	var i, styles = {};

	start = start.trim().split(';');

	i = start.length;

	while(--i>-1) {
		if(start[i].trim() != '') {
			var params = start[i].trim().split(':');

			styles[params[0].trim()] = {
				start: params[1].trim()
			}
		}
	}

	end = end.trim().split(';');

	i = end.length;

	while(--i>-1) {
		if(end[i].trim() != '') {
			var params = end[i].trim().split(':'), name = params[0].trim();

			if(styles[name]) {
				styles[name].end =  params[1].trim();
			} else {
				styles[name] = {
					start: el.style[name],
					end: params[1].trim()
				}
			}
		}
	}

	var f = [];

	for(i in styles) {
		if(styles[i].start.replace(/[-0-9]+/g, '') === styles[i].end.replace(/[-0-9]+/g, '')) {
			var s = styles[i].start.match(/[-0-9]+/g);
			var e = styles[i].end.match(/[-0-9]+/g);

			var count = 0;

			var str = '\'' + i + ': ' + styles[i].start.replace(/[-0-9]+/g, function(match, offset, string){
				var r = ' \' + ( (' + s[count] + ') * (1 - pos) + (' + e[count] +') * pos ) + \'';

				count++;

				return r;
			}) + '; \'';

			f.push(str);
		}
	}

	return new Function('pos', 'return ' + f.join('+'));
}

register('parallax', Parallax);