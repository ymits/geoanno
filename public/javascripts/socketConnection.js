(function() {
	window.geoanno = window.geoanno || {};
	window.geoanno.SocketConnection = {
		connect : function(url) {
			this.socket = io.connect(url);
		},
		get : function() {
			return this.socket;
		}
	};

})();