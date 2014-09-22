var HiQ = HiQ || {};

HiQ.App = (function () {

	var loader = $('#loader'),
		updateLatLng = false,
		lat, lng;
	
	var checkLocation = function () {
		$('body').append('<div id="map-canvas"></div>');
		
	    if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	    } else {
		    locationError();
	    }
	};
	
	var locationSuccess = function (position) {
		var lat = position.coords.latitude,
			lng = position.coords.longitude;
			
		populateMap(lat, lng);
	};
	
	var locationError = function () {
		var lat = 59.3310910,
			lng = 18.0685760;
		
		populateMap(lat, lng);
	};
	
	var populateMap = function (lat, lng) {
		var map = new google.maps.Map(document.getElementById('map-canvas'), {
			zoom: 17,
			center: new google.maps.LatLng(lat, lng),
			disableDefaultUI: true,
			panControl: false,
			zoomControl: false,
			scaleControl: false
		});
		
		$('#map-canvas').addClass('ready');
	};

    return {
        'init': function () {
        	
        	HiQ.Metro.init();
        	HiQ.News.init();
        
        	checkLocation();

        },
        'hideLoader': function () {
	        loader.addClass('hidden');
        },
        'showLoader': function () {
	        loader.removeClass('hidden');
        }

    };

})();

$(function () {
    HiQ.App.init();
});





/*var wsUri = "ws://echo.websocket.org/";
var output;

function init() {
	output = document.getElementById("output");
	testWebSocket();
}

function testWebSocket() {
	websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) { onOpen(evt) };
	websocket.onclose = function(evt) { onClose(evt) };
	websocket.onmessage = function(evt) { onMessage(evt) };
	websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
	writeToScreen("CONNECTED");
	doSend("WebSocket rocks");
}

function onClose(evt) {
	writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
	writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
	websocket.close();
}

function onError(evt) {
	writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
	writeToScreen("SENT: " + message);
	websocket.send(message);
}

function writeToScreen(message) {
	var pre = document.createElement("p");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = message;
	output.appendChild(pre);
}

window.addEventListener("load", init, false);*/