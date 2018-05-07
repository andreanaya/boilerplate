import './scss/index.scss';

import HistoryController from 'boilerplate/general/js/HistoryController.js';

export default class Docs {
    constructor(el) {
        HistoryController.init(true);

        el.subscribe('history:change', function(e) {
        	console.log(e);
        })
    }
}
