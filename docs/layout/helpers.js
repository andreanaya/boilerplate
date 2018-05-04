module.exports = {
	if_eq: function(v1, v2, options) {
		if(v1 === v2) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	if_not_eq: function(v1, v2, options) {
		if(v1 !== v2) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	if_lt: function(v1, v2, options) {
		if(v1 < v2) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	if_lt_eq: function(v1, v2, options) {
		if(v1 <= v2) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	if_gt: function(v1, v2, options) {
		if(v1 > v2) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	if_gt_eq: function(v1, v2, options) {
		if(v1 >= v2) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	for: function(from, to, options) {
		var accum = '';
		
		for(var i = from; i <= to; ++i) {
			options.data.index = i;
			accum += options.fn(this);
		}

		return accum;
	},

	raw: function(partialName) {
		return handlebars.partials[partialName];
	},

	objectlength: function(object) {
		return Object.keys(object).length;
	}
}
