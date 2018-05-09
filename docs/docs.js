'use strict';

//Components
import DocsEventSystem from './components/event-system';
import DocsLoader from './components/loader';
import DocsGestures from './components/gestures';
import DocsHistoryController from './components/history-controller';
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
[...document.querySelectorAll('[data-docs-scroll-controller]')].forEach( (el) => {
    new DocsScrollController(el);
});