(function() {'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.ElevationChart = window.geoanno.CanvasObject.extend(function(param) {
        this.elevationLine = new window.geoanno.ElevationLine({
        	width: param.width,
        	height: param.height,
        	elevationList : param.elevationList,
        	currentIndex : param.currentIndex
        });
    }).methods({

    });
})(); 