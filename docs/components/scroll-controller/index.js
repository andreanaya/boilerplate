import {register} from 'boilerplate/general/js/Factory.js';
import './lightbox.scss';

export default class Docs {
    constructor(el) {
		console.log('ok')
        
        var square = el.querySelector('.bg-green');

        square.track();

        square.addEventListener('enterScreen', function(e) {
            console.log('Enter Screen');
        });

        square.addEventListener('leaveScreen', function(e) {
            console.log('Leave Screen');
        });

        square.addEventListener('positionUpdate', function(e) {
            console.log('Position update');
            console.log(e.detail.amount);
            console.log(e.detail.speed);
            console.log('-----');
        });

        square.addEventListener('click', function(e) {
            // if(el.classList.contains('is-locked')) {
            //     el.unlock();
            // } else {
            //     el.lock();
            // }
            console.log('lightbox:open:docs')
            document.body.emit(new CustomEvent('lightbox:open:docs', {
                detail: {
                    url: '/docs/styleguide/typography'
                }
            }));
        })
    }
}

register('docs-scroll-controller', Docs);