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

	self.id = self.id||"";
	self.name = ko.observable(data.name||"");
	self.dateCreated = data.dateCreated||"";
	self.dateLastFinished = ko.observable(data.dateLastFinished||"");


	//set to default values
	self.duration = ko.observable(data.duration||exercisesPerSet);
	self.timeWorkoutPerExercise = ko.observable(data.timeWorkoutPerExercise||40);
	self.timeRestPerExercise = ko.observable(data.timeRestPerExercise||20);


	self.intensity = ko.observable(data.intensity||2);
	self.excercises = ko.observableArray(data.excercises||[]); //to grenerate random exercises

	self.isInRestMode = ko.observable(false);
	self.exercisesCompleted = ko.observable(0);

	self.currentExcercise = ko.computed(function(){
		return self.excercises()[self.exercisesCompleted()];
	});

	self.currentRestCountdown = ko.observable(self.timeRestPerExercise());
	self.currentExcerciseCountdown = ko.observable(0);

	var startRestMode = function(onRestCompleted){
		var currentIntervalDuration = 1;
		self.currentRestCountdown(self.timeRestPerExercise()-1);
		restTimer = setInterval(function(){
			self.currentTimeSec(self.currentTimeSec()+1);
			if(currentIntervalDuration < self.timeRestPerExercise()){
				currentIntervalDuration++;
				self.currentRestCountdown(self.timeRestPerExercise() - currentIntervalDuration);
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
		var currentIntervalDuration = 1;
		self.currentRestCountdown(self.timeWorkoutPerExercise()-1);
		exerciseTimer = setInterval(function(){
			self.currentTimeSec(self.currentTimeSec()+1);
			if(currentIntervalDuration < self.timeWorkoutPerExercise()){
				currentIntervalDuration++;
				self.currentExcerciseCountdown(self.timeWorkoutPerExercise() - currentIntervalDuration);
			}else{
				clearInterval(exerciseTimer);				
				self.currentRestCountdown(self.timeRestPerExercise());
				self.currentExcerciseCountdown(0);
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
					
					self.nextExercise();
				}else{
					self.name(self.duration() + "min Circuit " + new Date().getFullYear() + "/" + new Date().getMonth() + "/" + new Date().getDate());
					dal.saveNewCircuit(self.name(), self.duration(), ko.toJS(self.excercises()), function(circuitId){
						$(self).trigger("circuitDone", [circuitId]).off("circuitDone");
					});					
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
		self.currentTimeSec(0);
		self.excercises()[self.exercisesCompleted()].isActive(false);
		self.exercisesCompleted(0);
		$(self).off("circuitDone");
	};

	self.start = function(){
		var repeatBodypart = self.duration()/exercisesPerSet;

		if(self.excercises().length == 0 || self.excercises().length != (repeatBodypart * exercisesPerSet)){
			dal.getRandomCircute(repeatBodypart, function(newExcercises){

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