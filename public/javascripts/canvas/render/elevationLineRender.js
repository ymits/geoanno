(function() {
    'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.ElevationLineRender = window.geoanno.CanvasRender.extend(function() {

    }).methods({
    
    	renderObject : function(ctx2d, canvasObject) {
    		var maxHeight = canvasObject.maxHeightElevation;
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
        	ctx2d.fillStyle = 'rgba(192, 80, 77, 0.5)'; // 赤
        	ctx2d.stroke();
        	ctx2d.closePath();
        	var grad = ctx2d.createLinearGradient(0,0, 0,canvasObject.height);
        	grad.addColorStop(0,'rgba(192, 80, 77, 0.5)');
        	grad.addColorStop(1,'rgb(255, 255, 255)');
        	ctx2d.fillStyle = grad;
        	ctx2d.fill();
        },
        
        drowCurrentPosition : function (ctx2d, canvasObject, maxHeight) {
        	ctx2d.beginPath();
        	var x = this.getX(canvasObject.width, canvasObject.currentIndex, canvasObject.elevationList.length);
    		//var y = this.getY(canvasObject.height, canvasObject.elevationList[canvasObject.currentIndex], maxHeight);
        	ctx2d.fillStyle = 'rgba(102, 102, 102, 0.5)'; // 青
        	//ctx2d.arc(x, y, 3, 0, Math.PI*2, false);
        	//ctx2d.fill();
        	ctx2d.fillRect(0, 0, x, canvasObject.height);
        },
        
        getX : function(canvasWidth, index, maxIndex){
        	return canvasWidth * ( index / ( maxIndex - 1 ));
        },
        
        getY : function(canvasHeight, height, maxHeight){
        	return ((canvasHeight - 10) * ((maxHeight - height) / maxHeight ))+10;
        }
    });
})();