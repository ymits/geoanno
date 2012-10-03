(function() {'use strict';

	window.geoanno = window.geoanno || {};
	window.geoanno.MapView = Backbone.View.extend({
		events : {
			"click .info> .ui-grid-b > .ui-block-c button" : "moveToCurrentPosition"
		},
		initialize : function() {
			this.map = new google.maps.Map(this.$('#map').get(0), {
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				zoom : 15,
				navigationControl : true,
				navigationControlOptions : {
					style : google.maps.NavigationControlStyle.ANDROID
				}
			});

			this.setHeight();
			$(window).bind('resize', this.setHeight);

			this.markerStore = {};

			this.socket = window.geoanno.SocketConnection.get();
			var self = this;
			this.socket.on('position', function(param) {
				self.drowPositionMarker.call(self, param);
			});

			this.nameText = this.$('#name');
			this.accountId = this.$('#accountId');

			this.searchCurrentPosition(true);
			setInterval(function() {
				self.searchCurrentPosition.call(self, false);
			}, 60000);

			this.drowJirodeLine();
		},

		searchCurrentPosition : function(init) {
			var self = this;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					init && self.map.setCenter(location);

					var param = {
						'accountId' : self.accountId.val(),
						'name' : self.nameText.val() || '*',
						'position' : location
					};

					self.drowPositionMarker(param);
					self.socket.emit('currentPosition', param);
				}, function() {

				});
			}
		},

		drowPositionMarker : function(param) {
			this.deleteMarker(param);
			this.createMarker(param);
		},

		deleteMarker : function(param) {
			var currenctMarker = this.markerStore[param.accountId];
			currenctMarker && currenctMarker.setMap(null);
			delete this.markerStore[param.accountId];
		},

		createMarker : function(param) {
			var markerImage = new google.maps.MarkerImage('/images/marker.png', new google.maps.Size(20, 20), new google.maps.Point(0, 0), new google.maps.Point(10, 10));

			var marker = new google.maps.Marker({
				position : new google.maps.LatLng(param.position.Xa, param.position.Ya),
				title : param.name,
				icon : 'http://chart.apis.google.com/chart?chst=d_bubble_icon_text_big&chld=bicycle|edge_bc|' + param.name + '|7FFF00|000000',
				shadow : markerImage
			});
			this.markerStore[param.accountId] = marker;

			marker.setMap(this.map);
		},

		moveToCurrentPosition : function() {
			this.searchCurrentPosition(true);
		},

		setHeight : function() {
			var pageHeight = $(window).height() - 55;
			this.$('#map').css("height", pageHeight);
		},

		drowJirodeLine : function() {
			var flightPath = new google.maps.Polyline({
				path : window.geoanno.lineData,
				strokeColor : "#FF0000",
				strokeOpacity : 0.5,
				strokeWeight : 6
			});
			flightPath.setMap(this.map);
		}
	});
})();
