import {register} from 'boilerplate/general/js/Factory.js';

import './scss/index.scss';

import {init} from 'boilerplate/general/js/HistoryController.js';

export default class Docs {
    constructor(el) {
        init(true);

        el.subscribe('history:change', function(e) {
        	console.log(e);
        })
    }
}


register('docs-history-controller', Docs);