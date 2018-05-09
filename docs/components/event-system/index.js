import './scss/index.scss';

import {register} from 'boilerplate/general/js/Factory.js';
import {subcribe, broadcast} from 'boilerplate/general/js/EventSystem.js';

export default class Docs {
    constructor(el) {
        let squares = document.querySelectorAll('.squared');
        let blockers = document.querySelectorAll('.bg-pink');

        const onTest = function(e) {
            console.log('>>>>> test docs');
        }

        const onBlock = function(e) {
            e.target.classList.add('block');
            console.log('>>>>> BLOCK!');
        }

    	subscribe('test', function(e) {
            console.log('>>>>> Global event docs')
        });

        squares.forEach(function(square) {
            square.subscribe('test', onTest);
        });

        squares[0].addEventListener('click', function(e) {
            document.body.emit(new Event('test'));
        })

        squares[1].addEventListener('click', function(e) {
            el.emit(new Event('test'));
        })

        squares[2].addEventListener('click', function(e) {
            broadcast(new Event('test'));
        })

        squares[3].addEventListener('click', function(e) {
            blockers.forEach(function(blocker) {
                blocker.unblock('test', onBlock);
                blocker.removeEventListener('block', onBlock);
                blocker.classList.remove('block');
            });
        })

        squares[4].addEventListener('click', function(e) {
            blockers.forEach(function(blocker) {
                blocker.block('test', onBlock);
                blocker.addEventListener('block', onBlock);
            });
        })

        squares[5].addEventListener('click', function(e) {
            this.broadcast(new Event('test'));
        })
    }
}

register('docs-event-system', Docs);