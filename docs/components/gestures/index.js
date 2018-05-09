import Gesture from 'boilerplate/general/js/Gesture.js';

export default class Docs {
    constructor(el) {
		el.enableGestures();

        el.addEventListener(Gesture.SWIPE_LEFT, function(e) {
        	console.log('swipe left');
        });

        el.addEventListener(Gesture.SWIPE_RIGHT, function(e) {
        	console.log('swipe right');
        });

        el.addEventListener(Gesture.TAP, function(e) {
        	console.log('tap');
        });
    }
}