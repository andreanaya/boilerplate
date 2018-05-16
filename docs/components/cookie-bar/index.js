import {register} from 'boilerplate/general/js/Factory.js';
import {show} from 'boilerplate/general/js/NotificationController.js';
import {get, remove, has} from 'boilerplate/general/js/CookieController.js';

import './cookie-bar.scss';
import Template from './cookie-bar.hbs';
import CookieBar from 'boilerplate/components/cookie-bar';

export default class Docs {
    constructor(el) {
        if(has('test')) {
            el.insertAdjacentHTML('afterbegin', 'Have cookie: '+get('test')+'<br/>');
        } else {
            el.insertAdjacentHTML('afterbegin', 'Don\'t have cookie<br/>');

            var template = document.createElement('template');
            template.innerHTML = Template();
            
            var cookieBar = new CookieBar(template.content.firstChild, 'test');
            show(cookieBar);
        }

        el.querySelector('[data-remove]').addEventListener('click', () => {
            remove('test');
        });
    }
}

register('docs-cookie-bar', Docs);