(function() {
    'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.CanvasRender = window.klass(function() {
    }).methods({
    
    	/**
    	 * レンダリング共通処理
    	 */
    	render : function(ctx2d, canvasObject) {
    		this.renderObject(ctx2d, canvasObject);
    	},
    	
        /**
         * 実際のレンダリング処理です。サブクラスで実装します。
         */
        renderObject : function(ctx2d, canvasObject) {
        }
    });
})();