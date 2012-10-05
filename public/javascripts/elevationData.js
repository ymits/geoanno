(function() {'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.elevationData = [];
    for (var i in window.geoanno.lineData) {
        window.geoanno.elevationData.push(window.geoanno.lineData[i][2]);
    }
})(); 