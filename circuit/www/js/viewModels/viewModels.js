//dal = data access layer
var CircuitFactoryViewModel = function(dal) {
	var self = this;

	self.activeScreen = ko.observable("circuit-home");

	self.currentCircuit = ko.observable();
	self.savedCircuits = ko.observableArray([]);


	self.addNewCircutes = function(id){
		self.currentCircuit(new Circuit());
	};

	self.startCircuit = function(){
		self.changeScreen('circuit-interval');
		self.currentCircuit().start();
		$(self.currentCircuit()).on("circuitDone", function(){
			self.changeScreen('circuit-summary');			
		});
	};

	self.cancelCircuit = function(){
		self.changeScreen('circuit-home');
		self.currentCircuit().cancel();
	};



	self.changeScreen = function(id){
		self.activeScreen(id);
	};


	dal.getPastCircuits(50, function(result){
		self.savedCircuits($.map(result, function(savedCircuit){
			return new Circuit(savedCircuit);
		}));
		if(self.savedCircuits().length == 0){
			self.activeScreen("circuit-setup");
		}
	});

	self.addNewCircutes();

};
