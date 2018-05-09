var isScrolling = false, isResizing = false, scrollTop = 0, width = -1, height = -1, breakpoint;

function setBreakpoint(b) {
	if(breakpoint != b) {
		breakpoint = b;
		
		document.body.emit(new CustomEvent('breakpoint', {
			detail: {
				breakpoint: breakpoint
			}
		}), 'children');
	}
}

function resize() {
	isResizing = false;

	var w = window.innerWidth;
	var h = window.innerHeight;

	if(height != h) {
		height = h;
		document.body.emit(new CustomEvent('hResize'), 'children');
	}

	if(width != w) {
		width = w;
		document.body.emit(new CustomEvent('wResize'), 'children');

		if(w<768) {
			setBreakpoint('mobile');
		} else if(w<1024) {
			setBreakpoint('tablet');
		} else if(w<1440) {
			setBreakpoint('desktop');
		} else {
			setBreakpoint('wide');
		}
	}

	document.body.emit(new CustomEvent('resize'), 'children');
}

function scroll() {
	isScrolling = false;

	document.body.emit(new CustomEvent('scroll', {
		detail: {
			speed: pageYOffset-scrollTop
		}
	}), 'children');

	scrollTop = pageYOffset;
}

function onScroll(e) {
	if(!isScrolling) {
		isScrolling = true;
		window.requestAnimationFrame(scroll);
	}
}

function onResize(e) {
	if(!isResizing) {
		isResizing = true;
		window.requestAnimationFrame(resize);
	}
}

function init() {
	var w = window.innerWidth;

	if(w<768) {
		breakpoint = 'mobile';
	} else if(w<1024) {
		breakpoint = 'tablet';
	} else if(w<1440) {
		breakpoint = 'desktop';
	} else {
		breakpoint = 'wide';
	}

	width = w;

	window.addEventListener('resize', onResize);
	window.addEventListener('scroll', onScroll);
}

module.exports = {
	init: init
}