import 'boilerplate/general/scss/index.scss';

import 'boilerplate/general/js/EventSystem.js';
import 'boilerplate/general/js/HistoryController.js';
import 'boilerplate/general/js/Gesture.js';
import 'boilerplate/general/js/GlobalEvents.js';
import 'boilerplate/general/js/ScrollController.js';
import 'boilerplate/general/js/Factory.js';

export function init() {
	setTimeout(function() {
		document.body.broadcast(new CustomEvent('app:init'));
		document.body.emit(new CustomEvent('app:show'));
	}, 100);
}