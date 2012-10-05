(function() {'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.CanvasRender = window.klass(function() {
    }).methods({

        /**
         * レンダリング共通処理
         */
        drow : function(ctx2d, canvasObject) {
            this.renderObject(ctx2d, canvasObject);
            this.renderChildObject(ctx2d, canvasObject);
        },

        /**
         * 実際のレンダリング処理です。サブクラスで実装します。
         */
        renderObject : function(ctx2d, canvasObject) {
        },
        
        renderChildObject: function(ctx2d, canvasObject){
        	for(var i in canvasObject){
        		if(canvasObject[i] instanceof window.geoanno.CanvasObject){
        			var chartEngine = window.geoanno.CanvasEngineHolder.get();
        			chartEngine.render(ctx2d , canvasObject[i]);
        		}
        	}
        }
    });
})(); 