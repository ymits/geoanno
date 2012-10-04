(function() {'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.CanvasEngine = window.klass(function() {
        this.renderList = [];
        this.createRenderer();
    }).methods({

        /**
         * レンダラを組み立てます
         */
        createRenderer : function() {
            this.enderList.push(new window.geoanno.ElevationChartRender());
            this.renderList.push(new window.geoanno.ElevationLineRender());
            this.renderList.push(new window.geoanno.CurrentPositionRender());
        },

        render : function(ctx2d, canvasObject) {
            for (var i in this.renderList) {
                this.renderList[i].render(ctx2d, canvasObject);
            }
        }
    });
})();
