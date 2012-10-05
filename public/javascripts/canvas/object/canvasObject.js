(function() {
    'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.CanvasObject = window.klass(function(param) {
    	this.top = param.top;
    	this.left = param.left;
    	this.width = param.width;
    	this.height = param.height;
    	
    	this.parent = null; // 親オブジェクト
    	this.children = []; // 子要素
    }).methods({
        /**
         * 子要素を追加します。
         */
        addChild : function(child) {
            if (!(child instanceof window.geoanno.CanvasObject)) {
                throw "child is not CanvasObject";
            }
            child.parent = this;
            this.children.push(child);
        }
    });
})();