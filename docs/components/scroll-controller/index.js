import {register} from 'boilerplate/general/js/Factory.js';
import './lightbox.scss';

export default class Docs {
    constructor(el) {
		console.log('ok')
        
        var square = el.querySelector('.bg-green').parentNode;

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

        console.log(square.nextElementSibling)

        square.previousElementSibling.addEventListener('click', function(e) {
            if(el.classList.contains('is-locked')) {
                el.unlock();
            } else {
                el.lock();
            }
        })

        square.addEventListener('click', function(e) {
            document.body.emit(new CustomEvent('lightbox:load:docs', {
                detail: {
                    url: '/docs/styleguide/typography'
                }
            }));
        })

        square.nextElementSibling.addEventListener('click', function(e) {
            document.body.emit(new CustomEvent('lightbox:inject:docs', {
                detail: {
                    html: '<div class="full-width padding-md">Test</div>'
                }
            }));
        })
    }
}

register('docs-scroll-controller', Docs);