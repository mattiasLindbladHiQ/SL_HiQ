var HiQ = HiQ || {};

HiQ.App = (function () {

	var container = $('#container'),
		loader = $('#loader'),
		firstAnimation = true,
		animationSpeed = 700,
		interval = setInterval(function () {
			initRequest();
			//initFakeRequest();
		}, 30000);
	
	var getPosition = function () {
		var position = '1002';
	
		return position;
	};
	
	var getTime = function () {	
		var time = settings.search_range_minutes;
	
		return time;
	};
	
	var initRequest = function () {
		var url = settings.url + '?key=' + settings.key + '&siteid=' + getPosition() + '&timewindow=' + getTime();
	
		setTimeout(function () {
			$.ajax({
				type : "GET",
				dataType: "json",
				url: url,
				xhrFields: { withCredentials: true },
		        crossDomain: true,
		        headers: { 'Access-Control-Allow-Credentials': true },
		        headers: { 'Access-Control-Allow-Origin': '*' },
		        headers: { 'Access-Control-Allow-Methods': 'GET' },
				success: function(data) {
					animateOut();
					updateContent(data.ResponseData);
				},
				error: function (arguments) {
					//console.log(arguments);
				}
			});
		
			//$.getJSON(url, function (data) {
			//	updateContent(data.ResponseData);
			//});
		}, animationSpeed * 2);
	};
	
	var initFakeRequest = function () {
		animateOut();
	
		var data = mockResponse;
		
		setTimeout(function () {
			updateContent(data.ResponseData);
		}, animationSpeed * 2);
	};

	var timeSpanAllowsUpdate = function () {
		var d = new Date(),
			day = d.getUTCDay(),
			hour = d.getHours(),
			from = settings.hour_from,
			to = settings.hour_to,
			dayIsAccessible = false;
			
		for (var i = 0; i < settings.days_running.length; i++) {
			dayIsAccessible = dayIsAccessible || settings.days_running[i] == day;
		}

		if (!dayIsAccessible) {
			return false;
		}
		
		return (hour >= from && hour <= to)
	};
	
	var updateContent = function (response) {
		updateContentFromLines(response.Metros, settings.metros);
		updateContentFromLines(response.Buses, settings.busses);
		updateContentFromLines(response.Trains, settings.trains);
		updateContentFromLines(response.Trams, settings.trams);
		updateContentFromLines(response.Ships, settings.ships);
	};
	
	var updateContentFromLines = function (data, lines) {

		if (lines.length == 0) {
			return;
		}

		for (var i = 0; i < data.length; i++) {
			var $this = data[i],
				from = $this.StopAreaName,
				lineNumber = $this.LineNumber,
				destination = $this.Destination,
				departureTime = $this.DisplayTime,
				transportMode = $this.TransportMode,
				GroupOfLine = $this.GroupOfLine,
				icon = getIcon(lineNumber, transportMode, GroupOfLine);			

			//testa detta.
			for (var l = 0; l < lines.length; l++) {
				if (lineNumber == lines[l]) {
					var populate = true,
						isTime = false;

					//Is the departure time a time (ex: 15:00)?
					if (departureTime.length == 5) {
						var suspectedColon = departureTime.substr(2, 3);
						isTime = (suspectedColon == ':');
					}

					if (departureTime.toLowerCase() == 'nu') { 
						populate = false; //Exclude any ride that is leaving right now
					} else if (isTime) {						
						//Do nothing. This is an if that excludes the departure filter, which is
						//also reliant on 5-length-strings.
					} else if (settings.filter_close_departures_minutes) {
						//Exclude all filtered times
						if (departureTime.length >= 5) {
							var timeInMin = parseInt(departureTime.substr(0, departureTime.length - 3));
							populate = (timeInMin > settings.filter_close_departures_minutes);
						}					
					}
					
					if (populate) {
						populateContent(destination, departureTime, icon, from);					
					}										
				}
			}
		}
	};
	
	var getIcon = function (line, mode, busline) {
		var mode = mode.toLowerCase(), icon;
	
		if (mode == 'metro') {
			if (line == '10' || line == '11') {
				icon = 'metro blue';
			} else if (line == '13' || line == '14') {
				icon = 'metro red';
			} else if (line == '17' || line == '18' || line == '19') {
				icon = 'metro green';
			}
		} else if (mode == 'bus') {
			if (busline == null) {
				icon = 'bus red';
			} else {
				icon = 'bus blue';
			}
		} else {
			icon = mode;
		}
		
		return icon;
	};
	
	var populateContent = function (destination, departureTime, icon, from) {
		container.append('<div class="departure"><div class="icon ' + icon + '"></div><span class="destination">' + destination + '</span><span class="time">' + departureTime + '</span><span class="from">Avgång från: ' + from + '</span></div>');
		
		animateIn();
	};
	
	var animateOut = function () {
		if (!firstAnimation) {
			showLoader();
			container.addClass('out');
			setTimeout(function () {
				resetContent();
			}, animationSpeed);
		}
		
		firstAnimation = false;
	};
	
	var animateIn = function () {
		hideLoader();
		container.removeClass('in');
	};
	
	var resetContent = function () {
		container.empty().addClass('in').removeClass('out');
	};
	
	var hideLoader = function () {
		loader.addClass('hidden');
	};
	
	var showLoader = function () {
		loader.removeClass('hidden');
	};
	
	var refreshPage = function () {
		setTimeout(function () {
			// Refresh the page after two hours
			location.reload();
		}, 7200000);
	};
	
	var checkLocation = function () {
	    if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showLocation);
	    }
	};
	
	var showLocation = function (position) {
		var lat = 59.3310301;//position.coords.latitude;
		var lng = 18.068776;//position.coords.longitude;
		
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
        
        	//checkLocation();

            // Init all functionality
            if (timeSpanAllowsUpdate()) {
				initRequest();
				//initFakeRequest();
			} else {
				clearInterval(interval);
			}
			
			refreshPage();
						
        }

    };

})();

$(function () {
    HiQ.App.init();
});