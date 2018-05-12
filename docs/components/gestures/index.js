import {register} from 'boilerplate/general/js/Factory.js';
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

        el.addEventListener(Gesture.TOUCH_START, function(e) {
            console.log('touch start', e.detail);
        });

        el.addEventListener(Gesture.TOUCH_MOVE, function(e) {
            console.log('touch move', e.detail);
        });

        el.addEventListener(Gesture.TOUCH_END, function(e) {
            console.log('touch end', e.detail);
        });

        el.addEventListener(Gesture.TAP, function(e) {
        	console.log('tap');
        });
    }
}

register('docs-gestures', Docs);