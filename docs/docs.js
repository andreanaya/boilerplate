'use strict';

import EventSystem from 'boilerplate/general/js/EventSystem.js';
import GlobalEvents from 'boilerplate/general/js/GlobalEvents.js';

GlobalEvents.init();

//Components
import DocsLoader from './components/loader';
import DocsGestures from './components/gestures';
import DocsHistoryController from './components/history-controller';
import DocsEventSystem from './components/event-system';
import DocsScrollController from './components/scroll-controller';

[...document.querySelectorAll('[data-docs-loader]')].forEach( (el) => {
    new DocsGestures(el);
});
[...document.querySelectorAll('[data-docs-gestures]')].forEach( (el) => {
    new DocsGestures(el);
});
[...document.querySelectorAll('[data-docs-history-controller]')].forEach( (el) => {
    new DocsHistoryController(el);
});
[...document.querySelectorAll('[data-docs-event-system]')].forEach( (el) => {
    new DocsEventSystem(el);
});
[...document.querySelectorAll('[data-docs-scroll-controller]')].forEach( (el) => {
    new DocsScrollController(el);
});