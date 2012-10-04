(function() {
    'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.CanvasEngine = window.klass(function() {
    	this.renderList = [];
    	this.createRenderer();
    }).methods({

        /**
         * レンダラを組み立てます
         */
        createRenderer : function() {
        	renderList.push(new window.geoanno.ElevationChartRender());
        	renderList.push(new window.geoanno.ElevationLineRender());
        	renderList.push(new window.geoanno.CurrentPositionRender());
        },
        
        render : function (){
        	
        }
    });
})();