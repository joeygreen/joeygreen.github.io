var Requests;
Ractive.load( '_fe/stache/requests.stache' ).then( function ( Comp ) {
	Requests = new Comp({
		el: '#requests',
		oninit: function() {
			var R = this;
			R.search('');
			this.on({
				search: function search(ev, s) {
					if(ev.original.keyCode != 13) { return; } // Enter submits
					R.search(s)
				},
				request: function (ev, track_id) {
					if(!_state.user.username) {
						$('#req-notice').html("You must be logged in to make a request.").addClass('show');
						setTimeout(function() { $('#req-notice').removeClass('show'); }, 2000);
						return;
					}
					$.ajax({

						dataType: "json",
						method: "POST",
						url: _api_url + "/station/"+_state.station+"/request/"+track_id,
						data: {
							user_name: _state.user.username,
							user_id: _state.user.user_id,
						},
						success: function(data) {
							var msg = data.message;
							if (msg == "OK") {
								var msg = data.track.name + "<br />has been added to the queue."
							}
							$('#req-notice').html(msg).addClass('show');
							setTimeout(function() { $('#req-notice').removeClass('show'); }, 2000);
							//alert(data.message);
							Queue.load();
						}
					});
				}
			});
		},
		search: function(s) {
			var R = this;
			$.ajax({
				dataType: "json",
				data: { search: s },
				url: _api_url + "/station/"+_state.station+"/tracks",
				success: function(data) {
					R.set('station_name', data.station.station_name);
					R.set('tracks', data.tracks);
				}
			});

		}
	});
});
