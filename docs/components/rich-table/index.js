import {register} from 'boilerplate/general/js/Factory.js';

import './style.scss';

export default class RichTable {
    constructor(el) {
        console.log('new rich table');
    }
}

register('rich-table', RichTable);