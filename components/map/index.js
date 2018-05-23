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
		let bounds = new google.maps.LatLngBounds();

		if(this.el.dataset.center !== 'auto') {
			bounds.extend(JSON.parse(this.el.dataset.center.replace(/([{,]\s?)([^:{,]*):([^,}]*)/gim, "$1\"$2\":$3")));
		}
		
		this.map = new google.maps.Map(this.el);

		if(this.el.dataset.markers) {
			let markers = JSON.parse(this.el.dataset.markers.replace(/([{,]\s?)([^:{,]*):([^,}]*)/gim, "$1\"$2\":$3"));

			markers.forEach((coords) => {
				let marker = new google.maps.Marker({
					position: coords,
					map: this.map
				})

				if(this.el.dataset.center === 'auto') bounds.extend(coords);
			});
		}

		let zoom = this.el.dataset.zoom ? parseInt(this.el.dataset.zoom) : 15;

		google.maps.event.addListener(this.map, 'zoom_changed', () => {
			let zoomChangeBoundsListener = google.maps.event.addListener(this.map, 'bounds_changed', function(event) {
				if (this.getZoom() > zoom)  this.setZoom(zoom);
				google.maps.event.removeListener(zoomChangeBoundsListener);
			});
		});

		this.map.fitBounds(bounds);
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