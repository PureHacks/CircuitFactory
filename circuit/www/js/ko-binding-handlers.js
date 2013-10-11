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

		var knobSize = $(document).width();
		if($(document).height() < knobSize){
			knobSize = $(document).height();
		}
		knobSize = knobSize * 0.8;
		// Turn the input into a knob on load
		var knob = $(element).knob({
			'min': 0,
			'max': 60,
			'step': 6,
			'width': knobSize,
			'height': knobSize,
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


ko.bindingHandlers.slideVisible = {
	init: function(element, valueAccessor) {
		$(element).slideToggle(ko.utils.unwrapObservable(valueAccessor()));
	},
	update: function(element, valueAccessor) {
		ko.utils.unwrapObservable(valueAccessor()) ? $(element).slideDown() : $(element).slideUp();
	}
};

ko.bindingHandlers.timeText = {
	update: function(element, valueAccessor, allBindingsAccessor, context) {
		
		var newValueAccessor = function() {
			var value = parseFloat(ko.utils.unwrapObservable(valueAccessor()));

			var minutes = Math.floor(value / 60);
			var seconds = value - minutes * 60;
			return minutes + "." + (seconds < 10 ? "0" : "") + seconds;
		};
		ko.bindingHandlers.text.update(element, newValueAccessor, allBindingsAccessor, context);
	}
};

ko.bindingHandlers.secondsText = {
	update: function(element, valueAccessor, allBindingsAccessor, context) {
		
		var newValueAccessor = function() {
			var value = parseInt(ko.utils.unwrapObservable(valueAccessor()));
			return (value < 10 ? "0" : "") + value ;
		};
		ko.bindingHandlers.text.update(element, newValueAccessor, allBindingsAccessor, context);
	}
};