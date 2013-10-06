/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	}
	,db : null
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	,bindEvents: function() {
		$(document)
			.on('deviceready', this.onDeviceReady)
			.on('dbready', this.onDbReady);
	}
	,onDeviceReady: function() {
		var  db = window.openDatabase("circuitFactory", "1.0", "Circuit Factory DB", 1000000)
			,dbCreated = window.localStorage.getItem("dbCreated");


		//TEMP: 
		dbCreated = "ForceDelete";

		if(dbCreated !== "1"){
			init.setupDb(db, function(){
				window.localStorage.setItem("dbCreated", "1"); 
				$(document).trigger('dbready', db);
			});
		} else {
			$(document).trigger('dbready', db);
		}
	}
	,onDbReady: function(evt, db) {
		ko.applyBindings(new CircuitFactoryViewModel(db));

		db.transaction(function(tx){tx.executeSql('SELECT * FROM EXERCISE');}, function(){console.log("ERROR",arguments);}, function(){console.log("SUCCESS",arguments)})
		
		$("#loading-overlay").fadeOut(1000);
	}
	,resetApp: function(){
		window.localStorage.removeItem("dbCreated");
		app.onDeviceReady();
	}
};
