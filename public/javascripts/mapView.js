(function() {'use strict';

	window.geoanno = window.geoanno || {};
	window.geoanno.MapView = Backbone.View.extend({
		initialize : function() {
			this.map = new google.maps.Map(this.$('#map').get(0), {
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				zoom : 15
			});

			this.positionStore = {};

			this.socket = window.geoanno.SocketConnection.get();
			var self = this;
			this.socket.on('position', function(param){
				self.drowPositionMarker.call(self, param);
			});

			this.nameText = this.$('#name');
			this.accountId = this.$('#accountId');

			this.searchCurrentPosition(true);
			setInterval(function() {
				self.searchCurrentPosition.call(self, false);
			}, 5000);
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
					}

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
			var currenctMarker = this.positionStore[param.accountId];
			currenctMarker && currenctMarker.setMap(null);
			delete this.positionStore[param.accountId];
		},

		createMarker : function(param) {
			var marker = new google.maps.Marker({
				position : new google.maps.LatLng(param.position.Xa, param.position.Ya),
				title : param.name,
				icon : 'http://chart.apis.google.com/chart?chst=d_bubble_text_small_withshadow&chld=bb|' + param.name + '|7FFF00|000000'
			});

			this.positionStore[param.accountId] = marker;

			marker.setMap(this.map);
		}
	});
})();
