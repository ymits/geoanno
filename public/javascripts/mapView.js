(function() {'use strict';

    window.geoanno = window.geoanno || {};
    window.geoanno.MapView = Backbone.View.extend({
        events : {
            "click .info> .ui-grid-a > .ui-block-a button" : "moveToCurrentPosition",
            "click .info> .ui-grid-a > .ui-block-b button" : "update",
            "click #memberList tr" : "selectMember",
            "touchstart #memberList tr" : "onTouch",
            "mousedown #memberList tr" : "onTouch",
            "touchend #memberList tr" : "onTouchEnd",
            "mouseup #memberList tr" : "onTouchEnd",
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
            this.memberParams = [];
            this.selfParam = {};

            this.searchCurrentPosition(true);

            this.drowJirodeLine();
            this.getMembers();
        },

        searchCurrentPosition : function(init, callback) {
            var self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    
                    self.selfParam = {
                        'accountId' : '*',
                        'name' : '現在地 ',
                        'position' : {
                          latitude:position.coords.latitude,
                          longitude:position.coords.longitude
                        },
                        updateTime:new Date().getTime()
                    };

                    init && self.setCenter(self.selfParam);
                    self.drowPositionMarker(self.selfParam);
                    self.updateJirodeElevation(self.selfParam);
                    
                    //$.post('/currentPosition', self.selfParam, 'json');
                    
                    callback && callback();
                }, function() {

                }, {enableHighAccuracy: true, timeout:6000});
            }
        },
        
        update : function(){
          this.deleteAllMarker();
          this.searchCurrentPosition(true);
          this.getMembers();
        },
        
        getMembers : function(){
          var self = this;
          $.post('/getMembers', function(data){
            self.memberParams = [];
            for(var i in data){
              self.memberParams.push(data[i]);
            }
            self.drawMemberList();
          }, 'json')
        },
        
        drawMemberList:function(){
          $('#memberList').find('tr').remove();
          for(var i in this.memberParams){
            var member = this.memberParams[i];
            var $member = $('<tr class="member">');
            $member.append($('<td class="name">'+member.name+'</td>'));
            var time = new Date(Number(member.updateTime));
            $member.append($('<td class="updateTime">('+time.getHours()+':'+time.getMinutes()+')</td>'));
            $member.data('param', member);
            $('#memberList').append($member);
            this.drowPositionMarker(member);
          }
        },
        
        setCenter : function(param){
          var location = new google.maps.LatLng(param.position.latitude, param.position.longitude);
          this.map.setCenter(location);
        },

        drowPositionMarker : function(param) {
            //this.deleteMarker(param);
            this.createMarker(param);
        },

        // deleteMarker : function(param) {
            // var currenctMarker = this.markerStore[param.accountId];
            // currenctMarker && currenctMarker.setMap(null);
            // delete this.markerStore[param.accountId];
        // },
        
        deleteAllMarker : function() {
          for(var i in this.markerStore){
            var currenctMarker = this.markerStore[i];
            currenctMarker && currenctMarker.setMap(null);
            delete this.markerStore[i];
          }
        },

        createMarker : function(param) {
            var markerImage = new google.maps.MarkerImage('/images/marker.png', new google.maps.Size(20, 20), new google.maps.Point(0, 0), new google.maps.Point(10, 10));

            var marker = new google.maps.Marker({
                position : new google.maps.LatLng(param.position.latitude, param.position.longitude),
                title : param.name,
                icon : 'http://chart.apis.google.com/chart?chst=d_bubble_icon_text_big&chld=bicycle|edge_bc|' + param.name + '|7FFF00|000000',
                shadow : markerImage,
                map:this.map
            });
            this.markerStore[param.accountId] = marker;
        },

        moveToCurrentPosition : function() {
            this.setCenter(this.selfParam);
        },
        
        selectMember : function(evt) {
          var param = $(evt.currentTarget).data('param');
          this.setCenter(param);
        },
        
        onTouch : function(evt){
          var $target = $(evt.currentTarget);
          $target.addClass('selected');
        },
        
        onTouchEnd : function(evt){
          var $target = $(evt.currentTarget);
          $target.removeClass('selected');
        },

        setHeight : function() {
            var pageHeight = $(window).height() - 138;
            this.$('#map').css("height", pageHeight);
        },

        drowJirodeLine : function() {
            this.drowJirodeRoute();
            this.drowJirodeElevation();
        },
        
        drowJirodeRoute : function(){
            var flightPath = new google.maps.Polyline({
                path : window.geoanno.routeData,
                strokeColor : "#FF0000",
                strokeOpacity : 0.5,
                strokeWeight : 6
            });
            flightPath.setMap(this.map);
        },
        
        drowJirodeElevation : function(){
            this.canvas = this.$('#canvasArea').get(0);
            var ctx2d = this.canvas.getContext('2d');
            this.elevationChart = new window.geoanno.ElevationChart({
                width : this.canvas.width,
                height : this.canvas.height,
                elevationList : window.geoanno.elevationData,
                currentIndex : 0
            });
            
            var chartEngine = window.geoanno.CanvasEngineHolder.get();
            chartEngine.render(ctx2d , this.elevationChart);
        },
        
        updateJirodeElevation : function(param){
            this.currentIndex = this.currentIndex || 0;
            this.currentIndex = this.getCurrentIndex(param);
            this.elevationChart.updateCurrentIndex(this.currentIndex);
            
            var ctx2d = this.canvas.getContext('2d');
            var chartEngine = window.geoanno.CanvasEngineHolder.get();
            chartEngine.render(ctx2d , this.elevationChart);
        },
        
        getCurrentIndex : function(param){
            var index = this.currentIndex;
            var diff = this.getDiff(param.position, window.geoanno.routeData[this.currentIndex]);
            for(var i = this.currentIndex + 1; i < window.geoanno.routeData.length; i++){
                var nextDiff = this.getDiff(param.position, window.geoanno.routeData[i]);
                if(nextDiff < diff){
                    diff = nextDiff;
                    index = i;
                }
            }
            return index;
        },
        
        getDiff: function(currentPosition, routeData){
            return Math.abs(currentPosition.latitude - routeData.lb) + Math.abs(currentPosition.longitude - routeData.mb);
        }
    });
})();
