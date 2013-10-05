(function($){
	var ViewModel = function() {
		var self = this;

		self.activeScreen = ko.observable("circuit-home");

		self.currentCircuit = ko.observable();
		self.savedCircuits = ko.observableArray();



		self.addNewCircutes = function(id){
			self.currentCircuit(new Circuit());
		};


		self.startCircuit = function(){
			
		};


		self.changeScreen = function(id){
			self.activeScreen(id);
		};
	};

	ko.applyBindings(new ViewModel());
})(jQuery);