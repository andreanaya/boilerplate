import {register} from 'boilerplate/general/js/Factory.js';

export default class Map {
	constructor(el) {
		this.el = el;

		if(checkMaps()) {
			this.el.subscribe('maps:ready', () => {
				this.createMap();
			})
		} else {
			this.createMap();
		}
	}
	createMap() {
		let coords = JSON.parse(this.el.dataset.coords.replace(/([{,])(\s?)([^:]*):([^,}]*)/gim, "$1$2\"$3\":$4"));
		
		this.map = new google.maps.Map(this.el, {
			center: coords,
			zoom: parseInt(this.el.dataset.zoom) || 15
        });

        this.marker = new google.maps.Marker({
          position: coords,
          map: this.map
        });
	}
}

function checkMaps() {
	if(document.querySelector('script[src="https://maps.googleapis.com/maps/api/js?key='+GOOGLE_API_KEY+'&callback=initMap"]') == undefined) {
		let tag = document.createElement('script');
		tag.src = 'https://maps.googleapis.com/maps/api/js?key='+GOOGLE_API_KEY+'&callback=initMap';
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		window.initMap = function() {
			document.body.emit(new CustomEvent('maps:ready'));
		}
	}

	return window.google === undefined;
}

register('map', Map);