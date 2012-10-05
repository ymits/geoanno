(function() {
    'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.ElevationLineRender = window.geoanno.CanvasRender.extend(function() {

    }).methods({
    
    	renderObject : function(ctx2d, canvasObject) {
    		var maxHeight = this.calcMaxHeight(canvasObject.elevationList);
    		this.drowElevationLine(ctx2d, canvasObject, maxHeight);
    		this.drowCurrentPosition(ctx2d, canvasObject, maxHeight);
        },
        
        drowElevationLine : function (ctx2d, canvasObject, maxHeight){
        	ctx2d.beginPath();
        	ctx2d.moveTo(0, canvasObject.height);
        	for(var i in canvasObject.elevationList){
        		var x = this.getX(canvasObject.width, i, canvasObject.elevationList.length);
        		var y = this.getY(canvasObject.height, canvasObject.elevationList[i], maxHeight);
        		ctx2d.lineTo(x, y);
        	}
        	ctx2d.lineTo(canvasObject.width, canvasObject.height);
        	ctx2d.closePath();
        	ctx2d.fillStyle = 'rgba(192, 80, 77, 0.5)'; // 赤
        	ctx2d.fill();
        },
        
        drowCurrentPosition : function (ctx2d, canvasObject, maxHeight) {
        	ctx2d.beginPath();
        	var x = this.getX(canvasObject.width, canvasObject.currentIndex, canvasObject.elevationList.length);
    		var y = this.getY(canvasObject.height, canvasObject.elevationList[canvasObject.currentIndex], maxHeight);
        	ctx2d.fillStyle = 'rgba(51, 102, 255, 1)'; // 青
        	ctx2d.arc(x, y, 3, 0, Math.PI*2, false);
        	ctx2d.fill();
        },
        
        calcMaxHeight : function(list){
        	var max = 0;
        	for(var i in list){
        		if(max < list[i]){
        			max = list[i];
        		}
        	}
        	return max;
        },
        
        getX : function(canvasWidth, index, maxIndex){
        	return canvasWidth * ( index / ( maxIndex - 1 ));
        },
        
        getY : function(canvasHeight, height, maxHeight){
        	return ((canvasHeight - 10) * ((maxHeight - height) / maxHeight ))+10;
        }
    });
})();