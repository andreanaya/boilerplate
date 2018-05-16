import {set} from 'boilerplate/general/js/CookieController.js';

export default class CookieBar {
	constructor(el, cookieName) {
		this.cookieName = cookieName;

		this.el = el;
		
		this.close = this.el.querySelector('[data-close]');
		this.close.addEventListener('click', onClose.bind(this));

		this.allow = this.el.querySelector('[data-allow]');
		this.allow.addEventListener('click', onAllow.bind(this));

		this.deny = this.el.querySelector('[data-deny]');
		this.deny.addEventListener('click', onDeny.bind(this));
	}
}

function onAllow(e) {
	set(this.cookieName, 'allow', 100);

	this.el.dispatchEvent(new CustomEvent('close'));
}

function onDeny(e) {
	set(this.cookieName, 'deny', 100);

	this.el.dispatchEvent(new CustomEvent('close'));
}

function onClose(e) {
	this.el.dispatchEvent(new CustomEvent('close'));
}