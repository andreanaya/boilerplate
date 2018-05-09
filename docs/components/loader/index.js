import Loader from 'boilerplate/general/js/Loader.js';

export default class Docs {
    constructor(el) {
        let bt1 = el.querySelector('.bg-pink');

        let loader = new Loader();

        loader.responseType = 'blob';

        loader.addEventListener('complete', (e) => {
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(e.detail);
            var img = document.createElement('img');
            el.appendChild(img);
            img.src = imageUrl;
        });

        bt1.addEventListener('click', (e) => {
            loader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST-gRkVxv_bLYBZNhkkUSLh9hmMtY6k1APQ_I5bB7fVSkMj9jd')
        });
    }
}
