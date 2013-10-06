(function($){

	var init = window.init = window.init||{};

	var genereicDbError = function(err) {
		console.log("Error processing SQL: "+err.code);
	};

	

	init.setupDb = function(db, onSuccess){
		db.transaction(function(tx) {
				tx.executeSql('DROP TABLE IF EXISTS EXERCISE');
				tx.executeSql('CREATE TABLE IF NOT EXISTS EXERCISE (id unique, data)');
				tx.executeSql('INSERT INTO EXERCISE (id, data) VALUES (1, "First row")');
				tx.executeSql('INSERT INTO EXERCISE (id, data) VALUES (2, "Second row")');
			},genereicDbError, function () {
				console.log("success!");
				onSuccess();
		});
	};


})();