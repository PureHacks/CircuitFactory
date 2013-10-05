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
			self.currentCircuit().start();
		};

		self.changeScreen = function(id){
			self.activeScreen(id);
		};

		if(self.savedCircuits().length == 0){
			self.addNewCircutes();
			self.activeScreen("circuit-setup");
		}
	};

	ko.applyBindings(new ViewModel());
})(jQuery);