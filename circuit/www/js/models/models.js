var Excercise = function() {
	this.id = "";
	this.name = "";
	this.image = "";
	this.intensity = ko.observable();
	this.coreAspect = ko.observableArray();
};

var Circuit = function(data) {
	data = data|| {};
	var self = this;
	var timer = null;

	self.id = "";
	self.name = ko.observable();
	self.dateCreated = "";
	self.dateLastFinished = ko.observable();

	//set to default values
	self.duration = ko.observable(data.duration||8);
	self.timeExercise = ko.observable(data.timeExercise||40);
	self.timeRest = ko.observable(data.timeRest||20);


	self.intensity = ko.observable(data.intensity||2);
	self.excercises = ko.observableArray(data.excercises||[]); //to grenerate random exercises

	self.currentExcercise = ko.observable();
	self.isInRestMode = ko.observable(false);

	self.nextExercise = function(){
		var currentTime 
		timer = setInterval(function(){
			if(self.isInRestMode()){

			}else{

			}

		},1000);
	};

	self.start = function(){

	};
};