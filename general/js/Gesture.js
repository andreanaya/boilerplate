var map = new WeakMap(),
	isTouching = false;

const	SWIPE_DURATION = 150,
		SWIPE_DISTANCE = 10;

const events = {
	TAP: 'onTap',
	TOUCH_START: 'onTouchStart',
	TOUCH_END: 'onTouchEnd',
	TOUCH_MOVE: 'onTouchMove',
	SWIPE_LEFT: 'onSwipeLeft',
	SWIPE_RIGHT: 'onSwipeRight',
	PINCH_START: 'onPinchStart',
	PINCH_MOVE: 'onPinchMove',
	PINCH_END: 'onPinchEnd',
	CANCEL: 'onCancel'
};

function onTouchStart(e) {
	if(isTouching) return;

	let touch = e.touches && e.touches.length > 0 ? e.touches[0] : false;

	if(!touch) return;

	let target = e.target;

	let el;

	while(target) {
		if(map.has(target)) {
			el = target;
			break;
		}
		
		target = target.parentNode;
	}

	if(el) {
		isTouching = true;

		let defaultPrevented,
			timestamp = Date.now(),
			anchorX = touch.screenX,
			anchorY = touch.screenY;

		el.dispatchEvent(new CustomEvent(events.TOUCH_START, {
			detail: {
				clientX: touch.clientX,
				clientY: touch.clientY,
				screenX: touch.screenX,
				screenY: touch.screenY
			}
		}));

		if(e.defaultPrevented) defaultPrevented = true;

		let context = {
			el: el,
			touch: touch,
			defaultPrevented: defaultPrevented,
			timestamp: timestamp,
			anchorX: anchorX,
			anchorY: anchorY,
			pinch: undefined
		};

		window.addEventListener('touchmove', context.onTouchMove = onTouchMove.bind(context), {passive: false});
		window.addEventListener('touchend', context.onTouchEnd = onTouchEnd.bind(context), {passive: false});
	}
}

function onTouchMove(e) {
	this.touch = e.touches && e.touches.length > 0 ? e.touches[0] : false;

	if(!this.touch) return;

	if(this.pinch === undefined && e.touches.length > 1) {
		let dx = e.touches[1].screenX - e.touches[0].screenX;
		let dy = e.touches[1].screenY - e.touches[0].screenY;

		this.pinch = {
			distance: Math.sqrt( dx*dx + dy*dy ),
			angle: Math.atan2(dy, dx),
			zoom: 1,
			rotation: 0,
			clientX: e.touches[0].clientX,
			clientY: e.touches[0].clientY,
			screenX: e.touches[0].screenX,
			screenY: e.touches[0].screenY
		}

		this.el.dispatchEvent(new CustomEvent(events.PINCH_START, {
			detail: {
				zoom: this.pinch.zoom,
				rotation: this.pinch.rotation,
				clientX: this.pinch.clientX,
				clientY: this.pinch.clientY,
				screenX: this.pinch.screenX,
				screenY: this.pinch.screenY
			}
		}));
	}
	else if(this.pinch) {
		let dx = e.touches[1].screenX - e.touches[0].screenX;
		let dy = e.touches[1].screenY - e.touches[0].screenY;

		this.pinch.zoom = Math.sqrt( dx*dx + dy*dy )/this.pinch.distance;
		this.pinch.rotation = Math.atan2(dy, dx)-this.pinch.angle;
		this.pinch.clientX = e.touches[0].clientX;
		this.pinch.clientY = e.touches[0].clientY;
		this.pinch.screenX = e.touches[0].screenX;
		this.pinch.screenY = e.touches[0].screenY;

		this.el.dispatchEvent(new CustomEvent(events.PINCH_MOVE, {
			detail: {
				zoom: this.pinch.zoom,
				rotation: this.pinch.rotation,
				clientX: this.pinch.clientX,
				clientY: this.pinch.clientY,
				screenX: this.pinch.screenX,
				screenY: this.pinch.screenY
			}
		}));
	}

	if(this.defaultPrevented === undefined) {
		this.defaultPrevented = Math.abs(this.anchorX-this.touch.screenX) > Math.abs(this.anchorY-this.touch.screenY);
	}

	if(this.defaultPrevented) {
		this.el.dispatchEvent(new CustomEvent(events.TOUCH_MOVE, {
			detail: {
				clientX: this.touch.clientX,
				clientY: this.touch.clientY,
				screenX: this.touch.screenX,
				screenY: this.touch.screenY
			}
		}));

		e.preventDefault();
	} else {
		isTouching = false;
		
		window.removeEventListener('touchmove', this.onTouchMove);
		window.removeEventListener('touchend', this.onTouchEnd);

		this.el.dispatchEvent(new CustomEvent(events.CANCEL));
	}
}

function onTouchEnd(e) {
	if(e.touches.length < 2 && this.pinch) {
		if(e.touches.length == 1) {
			this.touch = e.touches[0];
		}

		this.el.dispatchEvent(new CustomEvent(events.PINCH_END, {
			detail: {
				zoom: this.pinch.zoom,
				rotation: this.pinch.rotation,
				clientX: this.pinch.clientX,
				clientY: this.pinch.clientY,
				screenX: this.pinch.screenX,
				screenY: this.pinch.screenY,
				touch: this.touch
			}
		}));

		this.pinch = undefined;
	}

	if(e.touches.length > 0) return;

	if(this.defaultPrevented == undefined) {
		let isTap = (Math.sqrt(Math.pow(this.touch.screenX - this.anchorX, 2) + Math.pow(this.touch.screenY - this.anchorY, 2)) < SWIPE_DISTANCE);

		if(Math.sqrt(Math.pow(this.touch.screenX - this.anchorX, 2) + Math.pow(this.touch.screenY - this.anchorY, 2)) < SWIPE_DISTANCE) {
			this.el.dispatchEvent(new CustomEvent(events.TAP, {
				detail: {
					clientX: this.touch.clientX,
					clientY: this.touch.clientY,
					screenX: this.touch.screenX,
					screenY: this.touch.screenY
				}
			}));
		}
	}
	else if(this.defaultPrevented){
		if(Date.now()-this.timestamp < SWIPE_DURATION) {
			let distance = this.touch.screenX-this.anchorX;

			if(distance > SWIPE_DISTANCE) {
				this.el.dispatchEvent(new CustomEvent(events.SWIPE_RIGHT, {
					detail: {
						clientX: this.touch.clientX,
						clientY: this.touch.clientY,
						screenX: this.touch.screenX,
						screenY: this.touch.screenY
					}
				}));
			}
			else if(distance < -SWIPE_DISTANCE) {
				this.el.dispatchEvent(new CustomEvent(events.SWIPE_LEFT, {
					detail: {
						clientX: this.touch.clientX,
						clientY: this.touch.clientY,
						screenX: this.touch.screenX,
						screenY: this.touch.screenY
					}
				}));
			}
			else {
				this.el.dispatchEvent(new CustomEvent(events.TAP, {
					detail: {
						clientX: this.touch.clientX,
						clientY: this.touch.clientY,
						screenX: this.touch.screenX,
						screenY: this.touch.screenY
					}
				}));
			}
		}
		else {
			this.el.dispatchEvent(new CustomEvent(events.TOUCH_END, {
				detail: {
					clientX: this.touch.clientX,
					clientY: this.touch.clientY,
					screenX: this.touch.screenX,
					screenY: this.touch.screenY
				}
			}, true));
		}
	}

	isTouching = false;

	window.removeEventListener('touchmove', this.onTouchMove);
	window.removeEventListener('touchend', this.onTouchEnd);
}

export function hasGestures(el) {
	return map.has(el);
}

Element.prototype.enableGestures = function() {
	if('ontouchstart' in window) {
		this.addEventListener("touchstart", onTouchStart);
		map.set(this, true);
	}
}

Element.prototype.disableGestures = function() {
	this.removeEventListener("touchstart", onTouchStart);
	map.delete(this);
}

export default events;