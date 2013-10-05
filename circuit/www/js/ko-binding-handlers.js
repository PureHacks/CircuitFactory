ko.bindingHandlers.transitionScreen = {
    init: function(element, valueAccessor) {
        $(element).toggle(ko.utils.unwrapObservable(valueAccessor()));
    },
    update: function(element, valueAccessor) {
        ko.utils.unwrapObservable(valueAccessor()) ? $(element).fadeIn() : $(element).fadeOut();
    }
};