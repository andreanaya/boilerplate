import {register} from 'boilerplate/general/js/Factory.js';

export default class Form {
	constructor(el) {
		this.el = el;
		this.el.addEventListener('submit', this.onSubmit = onSubmit.bind(this));
	}

	submit() {
		console.log('submit form');
	}
}

const types = [
	'Text',
	'Email',
	'Number',
	'Checkbox',
	'Radio',
	'Password',
	'ConfirmPassword',
	'Date',
	'Month',
	'Telephone',
	'Week',
	'Time',
	'File',
	'Select',
	'Textarea'
];

export class Field {
	constructor(el) {
		this.el = el;
		this.type = this.field.tagName.toLowerCase() === 'input' ? this.field.type : this.field.tagName.toLowerCase();

		this.field = this.el.querySelector('input, select, textarea');
		this.field.addEventListener('change', onChange.bind(this));
		this.field.addEventListener('focus', onFocus.bind(this));
		this.field.addEventListener('blur', onBlur.bind(this));
		this.field.addEventListener('invalid', onInvalid.bind(this));
		this.field.addEventListener('input', onInput.bind(this));
	}
}

function checkFill() {
	if (this.field.value === '') {
		this.el.classList.remove('is-filled');
		this.el.classList.add('is-empty');
	} else {
		this.el.classList.add('is-filled');
		this.el.classList.remove('is-empty');
	}
}

function onChange(e) {
	checkFill.call(this);
}

function onFocus(e) {
	this.el.classList.add('is-focused');
}

function onBlur(e) {
	this.el.classList.remove('is-focused');
	checkFill.call(this);
	
	if(this.el.dataset.autovalidate !== undefined && this.field.value !== '') {
		this.field.checkValidity();
	}
}

function onInvalid(e) {
	this.el.classList.add('is-invalid');
	e.preventDefault();
}

function onInput() {
	this.el.classList.remove('is-invalid');
}

function onSubmit(e) {
	if (this.el.checkValidity()) {
		this.submit();
	}

	e.preventDefault();
}

register('form', Form);
register('field', Field);