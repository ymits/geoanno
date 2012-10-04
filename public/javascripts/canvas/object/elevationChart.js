(function() {
    'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.ElevationChart = window.geoanno.CanvasObject.extend(function() {
    	this.elevationLine = new window.geoanno.ElevationLine();
    	
    	this.currentPosition = new window.geoanno.CurrentPosition();
    }).methods({
    
    });
})();