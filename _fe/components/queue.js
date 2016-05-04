function sec_to_h(sec) {
	//if(sec <= 0 && sec >= 10) { return "00:00"; }
	//if(sec <= 10) { return "??:??"; }
	if(sec <= 0) { return "??:??"; }
	if(sec < 60) { return "0:" + (sec < 10 ? "0" + sec : sec) ; }
	s = sec % 60;
	m = Math.floor(sec / 60);
	return m + ":" + (s < 10 ? "0" + s : s);
}

function date_to_12hr(d) {
	var hours = d.getHours();
	var m = d.getMinutes() < 10 ? "0"+d.getMinutes() : d.getMinutes();
	var s = d.getSeconds() < 10 ? "0"+d.getSeconds() : d.getSeconds();
	return ((hours + 11) % 12 + 1) + ":" + m + ":" + s + (hours >= 12 ? 'pm' : 'am');
}

//  Walt Disney World - epcot - futureworld - spaceship earth - Spaceship Earth 2007 full

var Queue;
Ractive.load( '_fe/stache/queue.stache' ).then( function ( Comp ) {
	Queue = new Comp({
		el: '#queue',
		load: function() {
			var R = this;
			clearTimeout(R._countdownTimer);
			R.set('station_name', _state.station_name);
			//R.set('now_playing', null); // For the loading box
			//R.set('queue', false);

			$.getJSON( _api_url + "/station/"+_state.station+"/queue" )
			.then( function ( data ) {
				var np = data.now_playing ;
				R._countdownStart = Date.now();  // Start a new timer
				R._countdownSecRemain = np.time_played + np.seconds - np.time_server

				R._timeIncrement = new Date();
				R._timeIncrement.setSeconds(R._timeIncrement.getSeconds() + R._countdownSecRemain);

				//R.set('now_playing', data.now_playing);
				R.set('queue', data.queue);
				R.countDown(np);
			});
		},
		_timeIncrement: null,
		_countdownTimer: null,
		_countdownStart: null,
		_countdownDelay: 1000,
		_countdownSecRemain: null,
		// The countDown Function
		countDown: function(np) {
			var R = this;
			var sec_since = Math.floor((Date.now() - R._countdownStart) / R._countdownDelay);
			sec_remain = R._countdownSecRemain - sec_since
			if(sec_remain <= 0) {
				clearTimeout(R._countdownTimer);
				R.load();
				return;
			}
			np.seconds_h = sec_to_h(sec_remain);
			R.set('now_playing', np);
			// Progress bar
			var percent = (100 - (sec_remain / np.seconds * 100)).toFixed(2) + 2;
			$('#np-title').css({backgroundSize: percent+"% 100%"});
			// Current Time
			R.set('current_time', date_to_12hr(new Date()));
			// Countdown
			var diff = R._countdownDelay - ((Date.now() - R._countdownStart) % R._countdownDelay);
			R._countdownTimer = setTimeout(function() {
				R.countDown(np);
			}, diff);
		},
		data: {
			upcomingTime: function(seconds) {
				var R = this;

				// Time of start
				var d = new Date(R._timeIncrement.getTime());
				// Increase the time
				R._timeIncrement.setSeconds(R._timeIncrement.getSeconds() + seconds);
				return date_to_12hr(d);
			},
			curUser: function(user_name) {
				if(user_name == _state.user.username) {
					return 'class="cur-user"';
				}
			}
		}
	});
});
