import {breakpoints as BREAKPOINTS} from 'config/styleguide.json';
import {subscribe} from 'boilerplate/general/js/EventSystem.js';

let isScrolling = false, isResizing = false, scrollTop = 0, width = -1, height = -1, breakpoint;
const breakpoints = Object.keys(BREAKPOINTS).map(key => ({breakpoint: key, value: BREAKPOINTS[key]})).sort((a, b) => (a.value - b.value));

function getBreakpoint(w) {
	let breakpoint = 'mobile';

	breakpoints.forEach((item) => {
		if(w > item.value) {
			breakpoint = item.breakpoint;
		}
	});

	return breakpoint;
}

function resize() {
	isResizing = false;

	let w = window.innerWidth;
	let h = window.innerHeight;

	if(height != h) {
		height = h;
		document.body.emit(new CustomEvent('hResize'));
	}

	if(width != w) {
		width = w;
		document.body.emit(new CustomEvent('wResize'));

		let b = getBreakpoint(w);

		if(breakpoint != b) {
			breakpoint = b;
			
			document.body.emit(new CustomEvent('breakpoint', {
				detail: {
					breakpoint: breakpoint
				}
			}));
		}
	}
	
	document.body.emit(new CustomEvent('resize'));
}

function scroll() {
	isScrolling = false;

	document.body.emit(new CustomEvent('scroll', {
		detail: {
			speed: pageYOffset-scrollTop
		}
	}));

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

subscribe('app:init', () => {
	let w = window.innerWidth;

	breakpoint = getBreakpoint(w);

	width = w;

	window.addEventListener('resize', onResize);
	window.addEventListener('scroll', onScroll);

	window.requestAnimationFrame(resize);
});