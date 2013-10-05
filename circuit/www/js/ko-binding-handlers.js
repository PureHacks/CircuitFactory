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

		console.log(ko.utils.unwrapObservable(valueAccessor()));
		// Turn the input into a knob on load
		var knob = $(element).knob({
			'change' : function (v) {
				var value = valueAccessor();
				value(v);
			}
		});
		console.log(knob);
	},
	update: function(element, valueAccessor) {
		$(element).val(ko.utils.unwrapObservable(valueAccessor())).trigger('change');
	}
};