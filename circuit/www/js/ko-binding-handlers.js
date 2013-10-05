ko.bindingHandlers.transitionScreen = {
    init: function(element, valueAccessor) {
        $(element).toggle(ko.utils.unwrapObservable(valueAccessor()));
    },
    update: function(element, valueAccessor) {
        ko.utils.unwrapObservable(valueAccessor()) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

ko.bindingHandlers.knobify = {
    init: function(element) {
        // Turn the input into a knob on load
        $(element).knob({
            'min': 0,
            'max': 60,
            'step': 6,
            'width': 300,
            'height': 300
        });
    }
};