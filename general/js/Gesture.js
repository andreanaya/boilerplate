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

	var touch = e.touches && e.touches.length > 0 ? e.touches[0] : false;

	if(!touch) return;

	var target = e.target;

	var context, pinch;

	while(target) {
		if(map.has(target)) {
			context = target;
			break;
		}
		
		target = target.parentNode;
	}

	if(context) {
		isTouching = true;

		var defaultPrevented,
			timestamp = Date.now(),
			anchorX = touch.screenX,
			anchorY = touch.screenY;

		context.dispatchEvent(new CustomEvent(events.TOUCH_START, {
			detail: {
				clientX: touch.clientX,
				clientY: touch.clientY,
				screenX: touch.screenX,
				screenY: touch.screenY
			}
		}));

		if(e.defaultPrevented) defaultPrevented = true;

		var onTouchMove = function(e) {
			touch = touch = e.touches && e.touches.length > 0 ? e.touches[0] : false;

			if(!touch) return;

			if(pinch === undefined && e.touches.length > 1) {
				var dx = e.touches[1].screenX - e.touches[0].screenX;
				var dy = e.touches[1].screenY - e.touches[0].screenY;

				pinch = {
					distance: Math.sqrt( dx*dx + dy*dy ),
					angle: Math.atan2(dy, dx),
					zoom: 1,
					rotation: 0,
					clientX: e.touches[0].clientX,
					clientY: e.touches[0].clientY,
					screenX: e.touches[0].screenX,
					screenY: e.touches[0].screenY
				}

				context.dispatchEvent(new CustomEvent(events.PINCH_START, {
					detail: {
						zoom: pinch.zoom,
						rotation: pinch.rotation,
						clientX: pinch.clientX,
						clientY: pinch.clientY,
						screenX: pinch.screenX,
						screenY: pinch.screenY
					}
				}));
			}
			else if(pinch) {
				var dx = e.touches[1].screenX - e.touches[0].screenX;
				var dy = e.touches[1].screenY - e.touches[0].screenY;

				pinch.zoom = Math.sqrt( dx*dx + dy*dy )/pinch.distance;
				pinch.rotation = Math.atan2(dy, dx)-pinch.angle;
				pinch.clientX = e.touches[0].clientX;
				pinch.clientY = e.touches[0].clientY;
				pinch.screenX = e.touches[0].screenX;
				pinch.screenY = e.touches[0].screenY;

				context.dispatchEvent(new CustomEvent(events.PINCH_MOVE, {
					detail: {
						zoom: pinch.zoom,
						rotation: pinch.rotation,
						clientX: pinch.clientX,
						clientY: pinch.clientY,
						screenX: pinch.screenX,
						screenY: pinch.screenY
					}
				}));
			}

			if(defaultPrevented === undefined) {
				defaultPrevented = Math.abs(anchorX-touch.screenX) > Math.abs(anchorY-touch.screenY);
			}

			if(defaultPrevented) {
				context.dispatchEvent(new CustomEvent(events.TOUCH_MOVE, {
					detail: {
						clientX: touch.clientX,
						clientY: touch.clientY,
						screenX: touch.screenX,
						screenY: touch.screenY
					}
				}));

				e.preventDefault();
			} else {
				isTouching = false;
				
				window.removeEventListener('touchmove', onTouchMove);
				window.removeEventListener('touchend', onTouchEnd);

				context.dispatchEvent(new CustomEvent(events.CANCEL));
			}
		}

		var onTouchEnd = function(e) {
			if(e.touches.length < 2 && pinch) {
				if(e.touches.length == 1) {
					touch = e.touches[0];
				}

				context.dispatchEvent(new CustomEvent(events.PINCH_END, {
					detail: {
						zoom: pinch.zoom,
						rotation: pinch.rotation,
						clientX: pinch.clientX,
						clientY: pinch.clientY,
						screenX: pinch.screenX,
						screenY: pinch.screenY,
						touch: touch
					}
				}));

				pinch = undefined;
			}

			if(e.touches.length > 0) return;

			if(defaultPrevented == undefined) {
				var isTap = (Math.sqrt(Math.pow(touch.screenX - anchorX, 2) + Math.pow(touch.screenY - anchorY, 2)) < SWIPE_DISTANCE);

				if(Math.sqrt(Math.pow(touch.screenX - anchorX, 2) + Math.pow(touch.screenY - anchorY, 2)) < SWIPE_DISTANCE) {
					context.dispatchEvent(new CustomEvent(events.TAP, {
						detail: {
							clientX: touch.clientX,
							clientY: touch.clientY,
							screenX: touch.screenX,
							screenY: touch.screenY
						}
					}));
				}
			}
			else if(defaultPrevented){
				if(Date.now()-timestamp < SWIPE_DURATION) {
					var distance = touch.screenX-anchorX;

					if(distance > SWIPE_DISTANCE) {
						context.dispatchEvent(new CustomEvent(events.SWIPE_RIGHT, {
							detail: {
								clientX: touch.clientX,
								clientY: touch.clientY,
								screenX: touch.screenX,
								screenY: touch.screenY
							}
						}));
					}
					else if(distance < -SWIPE_DISTANCE) {
						context.dispatchEvent(new CustomEvent(events.SWIPE_LEFT, {
							detail: {
								clientX: touch.clientX,
								clientY: touch.clientY,
								screenX: touch.screenX,
								screenY: touch.screenY
							}
						}));
					}
					else {
						context.dispatchEvent(new CustomEvent(events.TAP, {
							detail: {
								clientX: touch.clientX,
								clientY: touch.clientY,
								screenX: touch.screenX,
								screenY: touch.screenY
							}
						}));
					}
				}
				else {
					context.dispatchEvent(new CustomEvent(events.TOUCH_END, {
						detail: {
							clientX: touch.clientX,
							clientY: touch.clientY,
							screenX: touch.screenX,
							screenY: touch.screenY
						}
					}, true));
				}
			}

			isTouching = false;

			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('touchend', onTouchEnd);
		}

		window.addEventListener('touchmove', onTouchMove, {passive: false});
		window.addEventListener('touchend', onTouchEnd, {passive: false});
	}
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