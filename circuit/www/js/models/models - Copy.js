var Excercise = function() {
	this.id = "";
	this.name = "";
	this.image = "";
	this.intensity = ko.observable();
	this.coreAspect = ko.observableArray();
};

var Circuit = function() {
	var self = this;
	var timer = null;

	self.id = "";
	self.name = ko.observable();
	self.dateCreated = "";
	self.dateLastFinished = ko.observable();

	self.duration = ko.observable();
	self.timeExercise = ko.observable(40);
	self.timeRest = ko.observable(20);


	self.intensity = ko.observable();
	self.excercises = ko.observableArray();

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