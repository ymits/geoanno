(function() {'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.ElevationLine = window.geoanno.CanvasObject.extend(function(param) {

		this.elevationList = param.elevationList;
        this.maxHeightElevation = this.calcMaxHeight();		
		this.currentIndex = param.currentIndex;
    }).methods({

        calcMaxHeight : function(list){
            var max = 0;
            for(var i in this.elevationList){
                if(max < this.elevationList[i]){
                    max = this.elevationList[i];
                }
            }
            return max;
        }
    });
})(); 