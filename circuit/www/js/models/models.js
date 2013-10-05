var SavedCircuit = function() {
	this.name = "";
	this.date = "";
	this.intensity = ko.observable();
};


var Exercise = function() {
	this.name = "";
	this.intensity = ko.observable();
	this.coreAspect = ko.observableArray();
};