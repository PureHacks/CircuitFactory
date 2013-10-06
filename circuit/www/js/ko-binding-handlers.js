ko.bindingHandlers.transitionScreen = {
	init: function(element, valueAccessor) {
		$(element).toggle(ko.utils.unwrapObservable(valueAccessor()));
	},
	update: function(element, valueAccessor) {
		ko.utils.unwrapObservable(valueAccessor()) ? $(element).fadeIn() : $(element).fadeOut();
	}
};

ko.bindingHandlers.knobify = {
	init: function(element, valueAccessor) {
		// Turn the input into a knob on load
		var knob = $(element).knob({
            'min': 0,
            'max': 60,
            'step': 6,
            'width': 300,
            'height': 300,
            'fgColor': '#0bc9f0',
            'bgColor': '#fff',
            'font': 'Raleway Dots',
			'change' : function (v) {
				var value = valueAccessor();
				value(v);
			}
		});
	},
	update: function(element, valueAccessor) {
		$(element).val(ko.utils.unwrapObservable(valueAccessor())).trigger('change');
	}
};