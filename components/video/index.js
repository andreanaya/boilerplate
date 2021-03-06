import {register} from 'boilerplate/general/js/Factory.js';

export default class ChromelessVideo {
	constructor(el) {
		this.el = el;

		this.el.subscribe('video:play', (e) => {
			this.el.play();
		});

		this.el.subscribe('video:pause', (e) => {
			this.el.pause();
		});

		this.el.subscribe('video:mute', (e) => {
			this.el.muted = true;
		});

		this.el.subscribe('video:unmute', (e) => {
			this.el.muted = false;
		});

		this.el.subscribe('video:seek', (e) => {
			this.el.currentTime = e.detail.currentTime;
		});
	}
}

export class YouTubeVideo {
	constructor(el) {
		this.el = el;

		if(this.el.dataset.playerVars) {
			this.playerVars = JSON.parse(this.el.dataset.playerVars.replace(/([{,]\s?)([^:{,]*):([^,}]*)/gim, "$1\"$2\":$3"));
		} else {
			this.playerVars = {};
		}

		if(this.playerVars.rel === undefined) {
			this.playerVars.rel = 0;
		}

		this.button = this.el.querySelector('[data-button]');

		if(checkYT()) {
			this.el.subscribe('youtube:ready', () => {
				this.createPlayer();
			})
		} else {
			this.createPlayer();
		}
	}

	createPlayer() {
		let video = this.el.querySelector('[data-video]');

		this.video = new YT.Player(video.id, {
			videoId: video.id.substr('yt-'.length),
			playerVars: this.playerVars,
			events: {
				'onReady': onYTPlayerReady.bind(this),
				'onStateChange': onYTPlayerStateChange.bind(this)
			}
		});
	}
}

export class VimeoVideo {
	constructor(el) {
		this.el = el;

		this.button = this.el.querySelector('[data-button]');

		if(checkVimeo()) {
			this.el.subscribe('vimeo:ready', () => {
				this.createPlayer();
			})
		} else {
			this.createPlayer();
		}
	}

	createPlayer() {
		let video = this.el.querySelector('[data-video]');

		this.video = new Vimeo.Player(video.id, {
			id: video.id.substr('vm-'.length)
		});

		this.video.ready().then(()=> {
			this.video.on('ended', (e) => {
				this.el.classList.remove('is-playing');
			});

			this.button.addEventListener('click', (e) => {
				this.video.play().then(() => {
					this.el.classList.add('is-playing');
				})
			})
		})
	}
}

function checkYT() {
	if(document.querySelector('script[src="https://www.youtube.com/iframe_api"]') == undefined) {
		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		window.onYouTubeIframeAPIReady = function() {
			document.body.emit(new CustomEvent('youtube:ready'));
		}
	}

	return window.YT === undefined;
}

function checkVimeo() {
	if(document.querySelector('script[src="https://player.vimeo.com/api/player.js"]') == undefined) {
		let tag = document.createElement('script');
		tag.src = "https://player.vimeo.com/api/player.js";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		let id = setInterval(() => {
			if(Vimeo !== undefined) {
				document.body.emit(new CustomEvent('vimeo:ready'));
				clearInterval(id);
			}
		}, 10);
	}

	return window.YT === undefined;
}

function onYTPlayerReady() {
	this.button.addEventListener('click', (e) => {
		this.video.playVideo();
		this.el.classList.add('is-playing');
	})
}

function onYTPlayerStateChange(e) {
	if(e.data == YT.PlayerState.ENDED) {
		this.el.classList.remove('is-playing');
	}
}

export class BGVideo {
	constructor(el) {
		this.el = el;
		this.video = new ChromelessVideo(el.querySelector('video'));

		this.el.subscribe('resize', (e) => {
			this.resize();
		});

		this.video.el.addEventListener('loadedmetadata', (e)=> {
			this.resize();
		})

	}

	resize() {
		let W = this.el.offsetWidth;
		let H = this.el.offsetHeight;
		
		let w = W;
		let h = w*this.video.el.videoHeight/this.video.el.videoWidth >> 0;
		
		if(h<H) {
			h = H;
			w = h*this.video.el.videoWidth/this.video.el.videoHeight >> 0;
		}

		this.video.el.style.width = w+'px';
		this.video.el.style.height = h+'px';
		
		this.video.el.style.marginTop = ((H-h)>>1)+'px';
		this.video.el.style.marginLeft = ((W-w)>>1)+'px';
	}
}

export class InlineVideo {
	constructor(el) {
		this.el = el;

		this.video = new ChromelessVideo(el.querySelector('video'));

		setControls.call(this);

		if(this.video.el.paused && !this.video.el.autoplay) {
			this.el.classList.add('is-paused');
		}

		if(this.video.el.muted) {
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
		if(this.video.el.paused) {
			this.el.emit(new CustomEvent('video:play'));
			this.el.classList.remove('is-paused');
		} else {
			this.el.emit(new CustomEvent('video:pause'));
			this.el.classList.add('is-paused');
		}
	})
}

function setVolumeToggle(el) {
	el.addEventListener('click', (e) => {
		if(this.video.el.muted) {
			this.el.emit(new CustomEvent('video:unmute'));
			this.el.classList.remove('is-muted');
		} else {
			this.el.emit(new CustomEvent('video:mute'));
			this.el.classList.add('is-muted');
		}
	})
}

function setProgress(el) {
	let bar = el.querySelector('[data-control="progress-bar"]');
	let thumb = el.querySelector('[data-control="progress-thumb"]');

	if(thumb) {
		const onMouseDown = (e) => {
			if(!this.el.classList.contains('is-paused')) this.el.emit(new CustomEvent('video:pause'));
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		}

		const onMouseMove = (e) => {
			let bounds = el.getBoundingClientRect();
			let amount = (e.clientX - bounds.left)/bounds.width;
			
			this.el.emit(new CustomEvent('video:seek', {detail: {currentTime: this.video.el.duration*amount}}));
		}

		const onMouseUp = (e) => {
			if(!this.el.classList.contains('is-paused')) this.el.emit(new CustomEvent('video:play'));
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		}

		thumb.addEventListener('mousedown', onMouseDown);
	}

	this.video.el.addEventListener('timeupdate', (e) => {
		let amount = this.video.el.currentTime/this.video.el.duration;
		if(bar) bar.style.transform = 'scaleX('+amount+')';
		if(thumb) thumb.style.left = 100*amount+'%';
	});
}

function setTime(el) {
	let current = el.querySelector('[data-control="time-current"]');
	let total = el.querySelector('[data-control="time-total"]');


	this.video.el.addEventListener('timeupdate', (e) => {
		current.innerHTML = getTime(this.video.el.currentTime, el.dataset.format);
		total.innerHTML = getTime(this.video.el.duration, el.dataset.format);
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

register('youtube-video', YouTubeVideo);
register('vimeo-video', VimeoVideo);
register('bg-video', BGVideo);
register('inline-video', InlineVideo);