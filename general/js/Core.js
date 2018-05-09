import 'boilerplate/general/scss/index.scss';

import {broadcast} from 'boilerplate/general/js/EventSystem.js';
import 'boilerplate/general/js/Factory.js';
import 'boilerplate/general/js/HistoryController.js';
import 'boilerplate/general/js/GlobalEvents.js';
import 'boilerplate/general/js/Gesture.js';

export function init() {
	setTimeout(function() {
		broadcast(new CustomEvent('app:init'));
	}, 10);
}