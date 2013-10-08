(function(){

	var dal = window.dal = window.dal||{};

	//encapsulate database lazy load
	(function(){
		var db = null;
		dal.getDataBase = function(){
			if(db){
				return db;
			}
			db = window.openDatabase("circuitFactory", "1.0", "Circuit Factory DB", 1000000);
			return db;
		};
	})();


	var util = dal.util = {
		runQuery : function(sql, placeholder, onSuccess){
			function queryDB(tx) {
				tx.executeSql(sql, placeholder, querySuccess, genereicDbError);
			};

			function querySuccess(tx, results) {
				var returnArray = [];
				var len = results.rows.length;
				for (var i=0; i<len; i++){
					returnArray.push(results.rows.item(i));
				}
				onSuccess(returnArray);
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
		console.log("Error processing SQL: "+err.code);
	};

	dal.setupDb = function(onSuccess){
		$.getJSON("/js/dal/data.json", function(data) {	
			var onTransactionSuccess = function(){
				console.log("DAL> Tables Initialized");
				onSuccess();
			};

			var transactionCode = function(tx){
				tx.executeSql("DROP TABLE IF EXISTS EXERCISE");
				tx.executeSql("CREATE TABLE IF NOT EXISTS EXERCISE (id unique, exercise, bodyPart, coreAspect)");

				var queryBase = "INSERT INTO EXERCISE (id, exercise, bodyPart, coreAspect) VALUES (?, ?, ?, ?)";

				$.each(data, function(index, row) {
					tx.executeSql(queryBase, [index, row.exercise, row.bodyPart, row.coreAspect]);
				});
			};

			dal.getDataBase().transaction(transactionCode, genereicDbError, onTransactionSuccess);
		});
	};

	dal.getAllExcercises = function(onSuccess){
		util.runQuery('SELECT * FROM EXERCISE', [], onSuccess);
	};

	dal.getAllBodyparts = function(onSuccess){
		util.runQuery('SELECT DISTINCT bodyPart FROM EXERCISE', [], onSuccess);
	};

	dal.getAllCoreAspects = function(onSuccess){
		util.runQuery('SELECT DISTINCT coreAspect FROM EXERCISE', [], onSuccess);
	};

	dal.getExcercises = function(numberOfItems, onSuccess){
		util.runQuery('SELECT * FROM EXERCISE LIMIT ?', [numberOfItems], onSuccess);
	};

	dal.getExcercisesByBodypart = function(bodyPart, onSuccess){
		util.runQuery('SELECT * FROM EXERCISE WHERE bodyPart = ?', [bodyPart], onSuccess);
	};


	dal.getRandomCircute = function(repeatsBodypart, onSuccess){
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

				for(var i = 0; i < repeatsBodypart; i++){
					result.push(bodyPartExercise[i]);
				}
			});
			onSuccess(util.shuffle(result));
		});
	};


})();