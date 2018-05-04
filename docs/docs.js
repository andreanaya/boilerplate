'use strict';

//Components
import DocsEventSystem from './components/event-system';

[...document.querySelectorAll('[data-docs-event-system]')].forEach( (el) => {
    new DocsEventSystem(el);
});