(function(){

	var dal = window.dal = window.dal||{};

	//encapsulate database lazy load
	(function(){
		var db = null;
		dal.getDataBase = function(){
			return window.openDatabase("circuitFactory", "1.0", "Circuit Factory DB", 1000000);
		};
	})();


	var util = dal.util = {
		runQuery : function(sql, placeholder, onSuccess){
			function queryDB(tx) {
				tx.executeSql(sql, placeholder, querySuccess, genereicDbError);
			};

			function querySuccess(tx, results) {
				console.log("querySuccess", arguments);
				var returnArray = [];
				var len = results.rows.length;
				for (var i=0; i<len; i++){
					returnArray.push(results.rows.item(i));
				}
				onSuccess(returnArray, results);
			};

			dal.getDataBase().transaction(queryDB, genereicDbError);
		}
		,shuffle : function(array){
		  	var counter = array.length, temp, index;

			// While there are elements in the array
			while (counter > 0) {
				// Pick a random index
				index = Math.floor(Math.random() * counter);

				// Decrease counter by 1
				counter--;

				// And swap the last element with it
				temp = array[counter];
				array[counter] = array[index];
				array[index] = temp;
			}

			return array;
		}
		,unique : function(values) {
			var result = [];
			$.each(values, function(i, e) {
				if ($.inArray(e, result) == -1) result.push(e);
			});
			return result;
		}
	};

	var genereicDbError = function(err) {
		console.log(err);
		alert("Error processing SQL: "+err.code);
	};

	dal.setupDb = function(onSuccess){
		$.getJSON("js/dal/data.json", function(data) {	
			var onTransactionSuccess = function(){
				dal.saveNewCircuit("Demo Circuit", 5, data.slice(data.length - 6), function(){});
				onSuccess();
			};

			var transactionCode = function(tx){
				tx.executeSql("DROP TABLE IF EXISTS EXERCISE");
				tx.executeSql("CREATE TABLE IF NOT EXISTS EXERCISE (id INTEGER PRIMARY KEY AUTOINCREMENT, exercise TEXT NOT NULL DEFAULT '', bodyPart TEXT NOT NULL DEFAULT '', coreAspect TEXT NOT NULL DEFAULT '')");

				var queryBase = "INSERT INTO EXERCISE (exercise, bodyPart, coreAspect) VALUES (?, ?, ?)";

				$.each(data, function(index, row) {
					tx.executeSql(queryBase, [row.exercise, row.bodyPart, row.coreAspect]);
				});

				tx.executeSql("DROP TABLE IF EXISTS CIRCUIT");
				tx.executeSql("CREATE TABLE IF NOT EXISTS CIRCUIT (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT '', dateCreated TIMESTAMP DEFAULT (datetime('now','localtime')), dateLastFinished TIMESTAMP, duration INTEGER NOT NULL DEFAULT 0, intensity INTEGER NOT NULL DEFAULT 0, repetedExecutions INTEGER NOT NULL DEFAULT 1)");

				queryBase = "INSERT INTO CIRCUIT (name, duration, intensity) VALUES (?, ?, ?)";

				tx.executeSql("DROP TABLE IF EXISTS CIRCUITEXERCISES");
				tx.executeSql("CREATE TABLE IF NOT EXISTS CIRCUITEXERCISES (id INTEGER PRIMARY KEY AUTOINCREMENT, circuitId INTEGER, exerciseId INTEGER)");

			};

			dal.getDataBase().transaction(transactionCode, genereicDbError, onTransactionSuccess);
		});
	};

	dal.getAllExcercises = function(onSuccess){
		util.runQuery("SELECT * FROM EXERCISE", [], onSuccess);
	};

	dal.getExcercises = function(numberOfItems, onSuccess){
		util.runQuery("SELECT * FROM EXERCISE LIMIT ?", [numberOfItems], onSuccess);
	};

	dal.getPastCircuits = function(numberOfItems, onSuccess){
		util.runQuery("SELECT * FROM CIRCUIT LIMIT ?", [numberOfItems], onSuccess);
	};

	dal.getCircuitExercises = function(circuitId, onSuccess){
		util.runQuery("SELECT e.* FROM CIRCUITEXERCISES ce LEFT JOIN EXERCISE e on e.id = ce.exerciseId WHERE ce.circuitId = ?", [circuitId], onSuccess);
	};

	dal.getExcercisesByBodypart = function(bodyPart, onSuccess){
		util.runQuery("SELECT * FROM EXERCISE WHERE bodyPart = ?", [bodyPart], onSuccess);
	};

	dal.getRandomCircute = function(repeatBodypart, onSuccess){
		dal.getAllExcercises(function(exercises){
			var result = [], bodyPartExercise;
			var coreAspects = util.unique(jQuery.map(exercises, function(exercise, index) {
			  return exercise.coreAspect;
			}));

			exercises = util.shuffle(exercises);

			$.each(coreAspects, function(i, coreAspect) {
				bodyPartExercise = $.grep(exercises, function(exercise){
					return exercise.coreAspect == coreAspect;
				});
				for(var i = 0; i < repeatBodypart; i++){
					result.push(bodyPartExercise[i]);
				}
			});
			onSuccess(util.shuffle(result));
		});
	};

	dal.saveNewCircuit = function(name, duration, exercises, onSuccess){
		var intensityTemp = 0; //to implement laters

		function queryDB(tx) {
			tx.executeSql("INSERT INTO CIRCUIT (name, dateLastFinished, duration, intensity) VALUES (?, datetime('now','localtime'), ?, ?)", [name, duration, intensityTemp], function(tx, results){
					var circuitId = results.insertId;
					$.each(exercises, function(i,exercise){
						tx.executeSql("INSERT INTO CIRCUITEXERCISES (circuitId, exerciseId) VALUES (?, ?)", [circuitId, exercise.id||i], function(){}, genereicDbError);
					});
					onSuccess(circuitId);
				}, genereicDbError);
		};

		dal.getDataBase().transaction(queryDB, genereicDbError);

	};

})();