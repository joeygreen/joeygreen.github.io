// Where we keep our current application state
var _state = {
    station: 'requests',
    station_name: 'Requests',
    user: {
        username: false,
        user_id: false,
    }
}

// For debugging -- nginx is too fast! :)  delay=ms
function sleep(delay) {
    var start = Date.now();
    while (Date.now() < start + delay);
}

// Startup
$(function() {
    // Modal Stuff
    $("#modal .modal-close").click(function() {
        $("#modal").fadeOut()
    });
    $("#modal").click(function(ev) {
        if (ev.toElement.id == "modal") {
            $("#modal").fadeOut();
        }
    });

    var UserInfo;
    Ractive.load('_fe/stache/user-info.stache').then(function(Comp) {
        UserInfo = new Comp({
            el: '#user-info',
            oninit: function() {
                this.load();
            },
            load: function() {
                var R = this;
                $.getJSON(_site_url + "/_check_user.php")
                    .then(function(data) {
                        if(!data) {
                            Queue.load() // Fix the race condition
                            return;
                        }
                        _state.user.username = data.username;
                        _state.user.user_id = data.user_id;
                        R.set('user_name', data.username);
                        Queue.load() // Fix the race condition
                    });
            },
            signin_click: function() {
                var r = Ractive({
                    template: '#tpl-sign-in',
                    el: "#modal-content"
                });
                $('#modal').show().find('.modal-container').width("300px");
            }
        });
    });



    // Open the requests
    $('.expander-icon').on('click', function() {
        $(".expander-req").toggleClass('show');
    });


    // Station List
    $.getJSON(_api_url + "/station/", function(data) {
        data = {
            stations: data
        }
        data.station = _state.station
        var r = Ractive({
            template: '#tpl-menu-stations',
            el: "#stations",
            data: data,
            menu_click: function(station_slug, station_name) {
                _state.station = station_slug;
                _state.station_name = station_name;
                this.set('station', station_slug)
                Queue.load()
                Requests.search('');
                //station_requests();
            },
        });
    });
});
