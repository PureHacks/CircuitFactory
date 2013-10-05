(function($){
	var ViewModel = function() {
		var self = this;

		self.activeScreen = ko.observable("circuit-home");


		self.changeScreen = function(id){
			self.activeScreen(id);
		};
	};

	ko.applyBindings(new ViewModel());
})(jQuery);