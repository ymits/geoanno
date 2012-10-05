(function() {
    'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.ElevationChartRender = window.geoanno.CanvasRender.extend(function() {

    }).methods({
    
        renderObject : function(ctx2d, canvasObject) {
            ctx2d.clearRect(0, 0, canvasObject.width, canvasObject.height);
        	ctx2d.beginPath();
        	ctx2d.strokeRect(0, 0, canvasObject.width, canvasObject.height);
        }
    });
})();