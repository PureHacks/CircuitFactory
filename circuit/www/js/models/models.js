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
	var currentTimeSec = 0;

	var restTimer;
	var exerciseTimer;


	self.id = "";
	self.name = ko.observable();
	self.dateCreated = "";
	self.dateLastFinished = ko.observable();

	//set to default values
	self.duration = ko.observable(data.duration||6);
	self.timeExercise = ko.observable(data.timeExercise||6);
	self.timeRest = ko.observable(data.timeRest||2);


	self.intensity = ko.observable(data.intensity||2);
	self.excercises = ko.observableArray(data.excercises||[]); //to grenerate random exercises

	self.currentExcercise = ko.observable();
	self.isInRestMode = ko.observable(false);
	self.exercisesCompleted = ko.observable(0);

	var startRestMode = function(onRestCompleted){
		var currentIntervalDuration = 0;
		restTimer = setInterval(function(){
			currentTimeSec++;
			if(currentIntervalDuration < self.timeRest()){
				console.log("rest timer", currentIntervalDuration);
				currentIntervalDuration++;
			}else{
				clearInterval(restTimer);
				console.log("rest timer done", currentIntervalDuration);
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
			currentTimeSec++;
			if(currentIntervalDuration < self.timeExercise()){
				console.log("exercise timer", currentIntervalDuration);
				currentIntervalDuration++;
			}else{
				clearInterval(exerciseTimer);
				console.log("exercise timer done", currentIntervalDuration);
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
				
				if(currentTimeSec < (self.duration() * 10)){
					self.exercisesCompleted(self.exercisesCompleted()+1);
					console.log("NEXT EXERCISE", self.exercisesCompleted(), currentTimeSec, self.duration() * 10);
					
					self.nextExercise();
				}else{
					console.log("->>>> ALL DONE");
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
		console.log("CANCELED");
	};

	self.start = function(){
		console.log(self.duration());

		dal.getRandomCircute(2,function(result){
			console.log("Query Result", result);
		});
		
		self.nextExercise(true);
	};
};