(function() {'use strict';

    var CanvasEngine = window.klass(function() {
        this.renderList = [];
        this.createRenderer();
    }).methods({

        /**
         * レンダラを組み立てます
         */
        createRenderer : function() {
            this.renderList.push({
            	"class" : window.geoanno.ElevationChart,
            	"render" : new window.geoanno.ElevationChartRender()
            });
            this.renderList.push({
            	"class" : window.geoanno.ElevationLine,
            	"render" : new window.geoanno.ElevationLineRender()
            });
        },

        render : function(ctx2d, canvasObject) {
            for (var i in this.renderList) {
            	if(canvasObject instanceof this.renderList[i].class){
            		ctx2d.translate(canvasObject.top, canvasObject.left);
            		this.renderList[i].render.drow(ctx2d, canvasObject);
            	}
            }
        }
    });
    
    window.geoanno = window.geoanno || {};
    window.geoanno.CanvasEngineHolder = {
    	engine : new CanvasEngine(),
    	get : function(){
    		return this.engine;
    	}
    };
    
})();
