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
                zoom : 14,
                navigationControl : true,
                navigationControlOptions : {
                    style : google.maps.NavigationControlStyle.ANDROID
                }
            });

            this.setHeight();
            $(window).bind('resize', this.setHeight);
            
            this.drowJirodeLine();

            this.markerStore = {};
            this.memberParams = [];
            this.selfParam = {};

            this.update();
        },

        searchCurrentPosition : function(callback) {
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

                    self.setCenter(self.selfParam);
                    self.drowPositionMarker(self.selfParam);
                    self.updateJirodeElevation(self.selfParam);

                    callback && callback();
                }, function() {

                }, {enableHighAccuracy: true, timeout:6000});
            }
        },
        
        update : function(){
          this.deleteAllMarker();
          this.parallel([
            this.searchCurrentPosition,
            this.getMembers
          ], this.drawMemberList, this);
        },
        
        getMembers : function(callback){
          var self = this;
          $.post('/getMembers', function(data){
            self.memberParams = [];
            for(var i in data){
              self.memberParams.push(data[i]);
            }
            callback && callback();
          }, 'json')
        },
        
        drawMemberList:function(){
          $('#memberList').find('tr').remove();
          for(var i in this.memberParams){
            var member = this.memberParams[i];
            var $member = $('<tr class="member">');
            $member.append($('<td class="name">'+member.name+'</td>'));
            
            var distance = this.cal_distance(this.selfParam.position, member.position);
            $member.append($('<td class="distance"><div class="desc">現在地との距離</div><div class="val">'+this.format(distance)+'m</div></td>'));
            
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
            this.createMarker(param);
        },
        
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
        },
        
        cal_distance : function (pos1, pos2){
          var lat1 = pos1.latitude;
          var lon1 = pos1.longitude;
          var lat2 = pos2.latitude;
          var lon2 = pos2.longitude;
          
          //ラジアンに変換
          var a_lat = lat1 * Math.PI / 180;
          var a_lon = lon1 * Math.PI / 180;
          var b_lat = lat2 * Math.PI / 180;
          var b_lon = lon2 * Math.PI / 180;
      
          // 緯度の平均、緯度間の差、経度間の差
          var latave = (a_lat + b_lat) / 2;
          var latidiff = a_lat - b_lat;
          var longdiff = a_lon - b_lon;
      
          //子午線曲率半径
          //半径を6335439m、離心率を0.006694で設定してます
          var meridian = 6335439 / Math.sqrt(Math.pow(1 - 0.006694 * Math.sin(latave) * Math.sin(latave), 3));    
      
          //卯酉線曲率半径
          //半径を6378137m、離心率を0.006694で設定してます
          var primevertical = 6378137 / Math.sqrt(1 - 0.006694 * Math.sin(latave) * Math.sin(latave));     
      
          //Hubenyの簡易式
          var x = meridian * latidiff;
          var y = primevertical * Math.cos(latave) * longdiff;
      
          return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        },
        
        parallel:function(tasks, callback, ctx){
          var counter = tasks.length;
          for(var i = 0; i < tasks.length; i++){
            tasks[i].call(ctx, function(){
              counter--;
              if(counter === 0){
                callback && callback.call(ctx);
              }
            });
          }
        },
        
        /**
         * 左文字埋め
         * 例）
         * format(1234.56) => 1,234
         * format(1234.567, 2, ',', ' ') => 1 234,57
         * 
         * @param {String or Number} number 対象数字
         * @param {Number} decimals 有効な小数点（デフォルト：0）
         * @param {String} dec_point 小数点の区切り（デフォルト：.）
         * @param {String} thousands_sep 数字の区切り（デフォルト：,）
         */
        format:function number_format (number, decimals, dec_point, thousands_sep) {
          number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
          var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
              var k = Math.pow(10, prec);
              return '' + Math.round(n * k) / k;
            };
          // Fix for IE parseFloat(0.55).toFixed(0) = 0;
          s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
          if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
          }
          if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
          }
          return s.join(dec);
        }
    });
})();
