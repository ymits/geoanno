(function() {'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.ElevationChart = window.geoanno.CanvasObject.extend(function(param) {
        this.elevationLine = new window.geoanno.ElevationLine({
        	top: 1,
        	left: 1,
        	width: param.width-2,
        	height: param.height-2,
        	elevationList : param.elevationList,
        	currentIndex : param.currentIndex
        });
    }).methods({

        updateCurrentIndex : function(index){
            this.elevationLine.currentIndex = index;
        }
    });
})(); 