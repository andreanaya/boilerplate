import {register} from 'boilerplate/general/js/Factory.js';

export class InlineVideo {
	constructor(el) {
		this.el = el;

		this.video = el.querySelector('video');

		setControls.call(this);

		if(this.video.paused && !this.video.autoplay) {
			this.el.classList.add('is-paused');
		}

		if(this.video.muted) {
			this.el.classList.add('is-muted');
		}
	}
}

function setControls() {
	[...this.el.querySelectorAll('[data-control]')].forEach((control) => {
		switch(control.dataset.control) {
			case 'play':
				// TO-DO
				break;
			case 'pause':
				// TO-DO
				break;
			case 'stop':
				// TO-DO
				break;
			case 'play-toggle':
				setPlayToggle.call(this, control);
				break;
			case 'volume-toggle':
				setVolumeToggle.call(this, control);
				break;
			case 'time':
				setTime.call(this, control);
				break;
			case 'progress':
				setProgress.call(this, control);
				break;
			case 'volume':
				// TO-DO
				break;
		}
	})
}

function setPlayToggle(el) {
	el.addEventListener('click', (e) => {
		if(this.video.paused) {
			this.video.play();
			this.el.classList.remove('is-paused');
		} else {
			this.video.pause();
			this.el.classList.add('is-paused');
		}
	})
}

function setVolumeToggle(el) {
	el.addEventListener('click', (e) => {
		if(this.video.muted) {
			this.video.muted = false;
			this.el.classList.add('is-muted');
		} else {
			this.video.muted = true;
			this.el.classList.remove('is-muted');
		}
	})
}

function setProgress(el) {
	let bar = el.querySelector('[data-control="progress-bar"]');
	let thumb = el.querySelector('[data-control="progress-thumb"]');

	if(thumb) {
		const onMouseDown = (e) => {
			if(!this.el.classList.contains('is-paused')) this.video.pause();
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		}

		const onMouseMove = (e) => {
			let bounds = el.getBoundingClientRect();
			let amount = (e.clientX - bounds.left)/bounds.width;
			
			this.video.currentTime = this.video.duration*amount;
		}

		const onMouseUp = (e) => {
			if(!this.el.classList.contains('is-paused')) this.video.play();
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		}

		thumb.addEventListener('mousedown', onMouseDown);
	}

	this.video.addEventListener('timeupdate', (e) => {
		let amount = this.video.currentTime/this.video.duration;
		if(bar) bar.style.transform = 'scaleX('+amount+')';
		if(thumb) thumb.style.left = 100*amount+'%';
	});
}

function setTime(el) {
	let current = el.querySelector('[data-control="time-current"]');
	let total = el.querySelector('[data-control="time-total"]');


	this.video.addEventListener('timeupdate', (e) => {
		current.innerHTML = getTime(this.video.currentTime, el.dataset.format)
		total.innerHTML = getTime(this.video.duration, el.dataset.format)
		// let amount = this.video.currentTime/this.video.duration;
		// if(bar) bar.style.transform = 'scaleX('+amount+')';
		// if(thumb) thumb.style.left = 100*amount+'%';
	});
}

function getTime(time, format) {
	let s = (time%60 >> 0).toString();
	let m = ((time/60)%60 >> 0).toString();
	let h = ((time/60/60) >> 0).toString();
	
	return format.replace('HH', h.padStart(2, '0'))
				 .replace('MM', m.padStart(2, '0'))
				 .replace('SS', s.padStart(2, '0'));
}

register('inline-video', InlineVideo);