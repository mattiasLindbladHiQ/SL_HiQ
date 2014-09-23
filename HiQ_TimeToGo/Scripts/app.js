var HiQ = HiQ || {};

HiQ.App = (function () {

	var loader = $('#loader');
	
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
		var lat = settings.lat,
			lng = settings.lng;
		
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