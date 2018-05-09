var height = window.innerHeight;

Parallax.interpolateFunction = function(el, start, end) {
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

function Parallax(container) {
	this.container = container === document.documentElement ? document.documentElement : container;
	this.elements = [];
}

Parallax.prototype.addElement = function(el, type, callback, delay) {
	if(type != 'trigger' && type != 'parallax') return;

	if(this.elements.filter(function(item){
		return item.el === this;
	}, el).length > 0) return;

	this.elements.push({
		el: el,
		type: type,
		callback: callback,
		position: null,
		start: null,
		end: null,
		state: null,
		delay: parseFloat(delay || 0)
	})
}

Parallax.prototype.removeElement = function(el) {
	var i = this.elements.length;

	while(--i > -1) {
		if(this.elements[i].el === el) {
			this.elements.splice(i, 1);
		}
	}
}

Parallax.prototype.update = function() {
	var item, pos, bounds, i = this.elements.length, scroll = this.container.scrollTop || document.documentElement.scrollTop;

	while(--i > -1) {
		item = this.elements[i];

		if(item.position === null) {
			var transform = item.el.style.transform;

			item.el.style.transform = '';

			bounds = item.el.getBoundingClientRect();

			item.position = bounds.top + this.container.scrollTop;

			item.start = height;
			if(item.position < height && item.type == 'parallax') item.start = item.position;

			item.end = -bounds.height;

			item.el.style.transform = transform;
		}

		if(item.type == 'parallax') {
			pos = (item.start - item.position + scroll) / (item.start - item.end);

			if(pos > 0 && pos < 1) {
				item.state = 'parallax';

				item.callback.call(null, pos);
			}
			else if(pos <= 0) {
				if(item.state !== 'start') {
					item.callback.call(null, 0);
				}

				item.state = 'start';
			}
			else if(pos >= 1) {
				if(item.state !== 'end') {
					item.callback.call(null, 1);
				}

				item.state = 'end';
			}
		}
		else if(item.type == 'trigger') {
			pos = (item.start - item.position + scroll) / height;

			if(pos > 0 && !item.state) {
				this.triggerCallback(item, pos);
				//item.state = item.callback.call(null, pos);
			}
		}
	}
}

Parallax.prototype.triggerCallback = function(item, pos) {
  //if(item.waiting && item.waiting == true)
	//	return;
	if(item.delay > 0) {
		//item.waiting = true;
		var container = this.container;

		setTimeout(function() {
			//item.waiting = false;
			item.state = item.callback.call(null, pos)
		}, item.delay);

	} else {
		item.state = item.callback.call(null, pos);
	}
}

Parallax.prototype.resize = function() {
	height = window.innerHeight;

	var i = this.elements.length, scrollTop = this.container.scrollTop;

	while(--i>-1) {
		this.elements[i].position = null;
	}
}


function init() {

}

function destroy() {

}

module.exports = {
	init: init,
	destroy: destroy
};
