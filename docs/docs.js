'use strict';

//Components
import DocsGestures from './components/gestures';
import DocsHistoryController from './components/history-controller';
import DocsEventSystem from './components/event-system';

[...document.querySelectorAll('[data-docs-gestures]')].forEach( (el) => {
    new DocsGestures(el);
});
[...document.querySelectorAll('[data-docs-history-controller]')].forEach( (el) => {
    new DocsHistoryController(el);
});
[...document.querySelectorAll('[data-docs-event-system]')].forEach( (el) => {
    new DocsEventSystem(el);
});