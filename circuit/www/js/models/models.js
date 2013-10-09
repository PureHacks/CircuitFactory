var Excercise = function(data) {
	data = data|| {};

	var self = this;

	self.id = data.id||"";
	self.exercise = data.exercise||"";
	self.image = "";
	self.intensity = "";
	self.bodyPart = data.bodyPart||"";
	self.isActive = ko.observable(false);
};

var Circuit = function(data) {
	data = data|| {};
	var exercisesPerSet = 6;

	var self = this;

	var restTimer;
	var exerciseTimer;
	self.currentTimeSec = ko.observable(0);

	self.id = "";
	self.name = ko.observable();
	self.dateCreated = "";
	self.dateLastFinished = ko.observable();


	//set to default values
	self.duration = ko.observable(data.duration||exercisesPerSet);
	self.timeExercise = ko.observable(data.timeExercise||4);
	self.timeRest = ko.observable(data.timeRest||2);


	self.intensity = ko.observable(data.intensity||2);
	self.excercises = ko.observableArray(data.excercises||[]); //to grenerate random exercises



	self.isInRestMode = ko.observable(false);
	self.exercisesCompleted = ko.observable(0);

	self.currentExcercise = ko.computed(function(){
		return self.excercises()[self.exercisesCompleted()];
	});

	var startRestMode = function(onRestCompleted){
		var currentIntervalDuration = 0;
		restTimer = setInterval(function(){
			self.currentTimeSec(self.currentTimeSec()+1);
			if(currentIntervalDuration < self.timeRest()){
				currentIntervalDuration++;
			}else{
				clearInterval(restTimer);
				self.isInRestMode(false);
				if(typeof onRestCompleted === "function"){
					onRestCompleted();
				}
			}
		},1000);
	};


	var startExcerciseMode = function(onExerciseCompleted){
		var currentIntervalDuration = 0;

		exerciseTimer = setInterval(function(){
			self.currentTimeSec(self.currentTimeSec()+1);
			if(currentIntervalDuration < self.timeExercise()){
				//console.log("exercise timer", currentIntervalDuration);
				currentIntervalDuration++;
			}else{
				clearInterval(exerciseTimer);
				self.isInRestMode(true);
				if(typeof onExerciseCompleted === "function"){
					onExerciseCompleted();
				}
			}
		},1000);
	};

	self.nextExercise = function(skipRest){
		var currentIntervalDuration = 0;

		//start in restMode unless skipped
		self.isInRestMode(skipRest !== true);

		var exerciseModeInit = function(){
			startExcerciseMode(function(){
				
				if(self.exercisesCompleted()+1 < self.excercises().length){
					self.excercises()[self.exercisesCompleted()].isActive(false);
					self.exercisesCompleted(self.exercisesCompleted()+1);
					self.excercises()[self.exercisesCompleted()].isActive(true);

					//console.log("NEXT EXERCISE", self.exercisesCompleted(), self.currentTimeSec(), self.duration() * 10);
					
					self.nextExercise();
				}else{
					$(self).trigger("circuitDone").off("circuitDone");
				}
			});
		};
		
		//go through rest mode first
		if(self.isInRestMode()){
			startRestMode(function(){
				exerciseModeInit();
			});
		}else{
			exerciseModeInit();
		}
	};

	self.cancel = function(){
		clearInterval(restTimer);
		clearInterval(exerciseTimer);
		$(self).off("circuitDone");
	};

	self.start = function(){

		var repeatBodypart = self.duration()/exercisesPerSet;

		if(self.excercises().length == 0 || self.excercises().length != (repeatBodypart * exercisesPerSet)){
			//dal.getRandomCircute(repeatBodypart, function(newExcercises){
			$.getJSON("js/dal/data.json", function(newExcercises) {	

				self.excercises($.map(newExcercises, function(excercise) {
					return new Excercise(excercise);
				}));
				self.excercises()[0].isActive(true);
				self.nextExercise(true);
			});
		}else{
			self.excercises()[0].isActive(true);
			self.nextExercise(true);
		}
	};
};