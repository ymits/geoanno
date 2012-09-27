(function() {'use strict';

	window.geoanno = window.geoanno || {};
	window.geoanno.MapView = Backbone.View.extend({
		initialize : function() {
			this.map = new google.maps.Map(this.$('#map').get(0), {
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				zoom : 15
			});

			var self = this;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {

				}, function() {

				});
			}

			var socket = window.geoanno.SocketConnection.get();
			socket.on('position', function(data) {
				console.log(data);
			});
			socket.emit('currentPosition', {
				'test' : 'value'
			});

		},

		makeMarker : function(param) {
			var initialLocation = new google.maps.LatLng(param.position.coords.latitude, param.position.coords.longitude);
			this.map.setCenter(initialLocation);

			var marker = new google.maps.Marker({
				position : initialLocation,
				title : param.name
			});

			// To add the marker to the map, call setMap();
			marker.setMap(this.map);

			var contentString = param.name;

			var infowindow = new google.maps.InfoWindow({
				content : contentString
			});
			infowindow.open(this.map, marker);
		}
	});
})();
