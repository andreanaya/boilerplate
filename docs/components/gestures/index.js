export default class Docs {
    constructor(el) {
		el.enableGestures();

        el.addEventListener(Gesture.events.SWIPE_LEFT, function(e) {
        	console.log('swipe left');
        });

        el.addEventListener(Gesture.events.SWIPE_RIGHT, function(e) {
        	console.log('swipe right');
        });

        el.addEventListener(Gesture.events.TAP, function(e) {
        	console.log('tap');
        });
    }
}