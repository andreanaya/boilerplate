import {register} from 'boilerplate/general/js/Factory.js';

const map = new WeakMap();

export default class Form {
	constructor(el) {
		this.el = el;
		
		[...el.querySelectorAll('button, inptu[type="submit"]')].forEach((submit) => {
			submit.addEventListener('click', onSubmit.bind(this))
		});
	}

	validate() {
		return [...this.el.querySelectorAll('input, select, textarea')].filter(field => !map.get(field).validate()).length == 0;
	}

	submit() {
		console.log('submit form');
	}
}

/*
 * Text
 * Email
 * Number
 * Checkbox
 * Radio
 * Password
 * ConfirmPassword
 * Date
 * Month
 * Telephone
 * Week
 * Time
 * File
 * Select
 * Textarea
 */

export class InputField {
	constructor(el) {
		this.el = el;

		this.field = el.querySelector('[data-ref="input"]');

		map.set(this.field, this);

		this.field.addEventListener('change', onChange.bind(this));
		this.field.addEventListener('focus', onFocus.bind(this));
		this.field.addEventListener('blur', onBlur.bind(this));
		this.field.addEventListener('invalid', onInvalid.bind(this));
		this.field.addEventListener('input', onInput.bind(this));
	}

	checkFill() {
		if (this.field.value === '') {
			this.el.classList.remove('is-filled');
			this.el.classList.add('is-empty');

			return true;
		} else {
			this.el.classList.add('is-filled');
			this.el.classList.remove('is-empty');

			return false;
		}
	}

	validate() {
		if(this.field.checkValidity()) {
			this.el.classList.remove('is-invalid');
			return true;
		} else {
			this.el.classList.add('is-invalid');
			return false;
		}
	}
}

export class DateField {
	constructor(el) {
		this.el = el;
		
		this.day = el.querySelector('[data-ref="day"]');
        this.month = el.querySelector('[data-ref="month"]');
        this.year = el.querySelector('[data-ref="year"]');

        map.set(this.day, this);
        map.set(this.month, this);
        map.set(this.year, this);

        [this.day, this.month, this.year].forEach((el) => {
        	el.addEventListener('change', onChange.bind(this));
			el.addEventListener('focus', onFocus.bind(this));
			el.addEventListener('blur', onBlur.bind(this));
			el.addEventListener('invalid', onInvalid.bind(this));
			el.addEventListener('input', onInput.bind(this));
        });
	}

	checkFill() {
		if (this.day.value === '' && this.month.value === '' && this.year.value === '') {
			this.el.classList.remove('is-filled');
			this.el.classList.add('is-empty');

			return true;
		} else {
			this.el.classList.add('is-filled');
			this.el.classList.remove('is-empty');

			return false;
		}	
	}

	validate() {
		const dateString = this.year.value + '-' + this.month.value + '-' + this.day.value;
        let msg = '';

        if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) {
		    msg = 'Invalid';
        } else {
            const parts = dateString.split('-');
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);

            if (year < 1000 || year > 3000) {
                msg = 'Invalid';
            }

            if (month == 0 || month > 12) {
                msg = 'Invalid';
            }

            const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                monthLength[1] = 29;
            }

            if (day <= 0 || day > monthLength[month - 1]) {
                msg = 'Invalid';
            }
        }

        this.day.setCustomValidity(msg);
        this.month.setCustomValidity(msg);
        this.year.setCustomValidity(msg);

        if(msg == '') {
			this.el.classList.remove('is-invalid');
			return true;
		} else {
			this.el.classList.add('is-invalid');
			return false;
		}
	}
}

export class ConfirmPasswordField {
	constructor(el) {
		this.el = el;

		this.ref = document.getElementById(this.el.dataset.ref)

		this.field = el.querySelector('[data-ref="input"]');

		map.set(this.field, this);

		this.field.addEventListener('change', onChange.bind(this));
		this.field.addEventListener('focus', onFocus.bind(this));
		this.field.addEventListener('blur', onBlur.bind(this));
		this.field.addEventListener('invalid', onInvalid.bind(this));
		this.field.addEventListener('input', onInput.bind(this));
	}

	checkFill() {
		if (this.field.value === '') {
			this.el.classList.remove('is-filled');
			this.el.classList.add('is-empty');

			return true;
		} else {
			this.el.classList.add('is-filled');
			this.el.classList.remove('is-empty');

			return false;
		}
	}

	validate() {
		let msg = this.field.value != '' && this.field.value == this.ref.value ? '' : 'Invalid';
		
		this.field.setCustomValidity(msg);

		if(msg == '') {
			this.el.classList.remove('is-invalid');
			return true;
		} else {
			this.el.classList.add('is-invalid');
			return false;
		}
	}
}

function onChange(e) {
	this.checkFill();
}

function onFocus(e) {
	this.el.classList.add('is-focused');
}

function onBlur(e) {
	this.el.classList.remove('is-focused');
	
	if(this.checkFill() && this.el.dataset.autovalidate !== undefined) {
		this.validate();
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
	if (this.validate()) {
		this.submit();
	}

	e.preventDefault();
}

register('form', Form);
register('input', InputField);
register('date', DateField);
register('confirm-password', ConfirmPasswordField);