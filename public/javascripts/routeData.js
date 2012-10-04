(function() {'use strict';
    window.geoanno = window.geoanno || {};
    window.geoanno.routeData = [];
    for (var i in window.geoanno.lineData) {
        window.geoanno.routeData.push(new google.maps.LatLng(window.geoanno.lineData[i][1], window.geoanno.lineData[i][0]));
    }
})();
