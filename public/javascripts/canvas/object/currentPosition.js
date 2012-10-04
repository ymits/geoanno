(function() {
    'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.CurrentPosition = window.geoanno.CanvasObject.extend(function(currentDistance, currentElevation) {
    	this.currentDistance = currentDistance;
    	this.currentElevation = currentElevation;
    }).methods({
    
    });
})();