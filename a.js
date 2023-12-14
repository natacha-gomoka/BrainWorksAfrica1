$(function (){
    ///// Language Switching (2 languages: English and Chinese). /////
  
    // Initially disable language switching button.
    $('#switch-lang').css({'pointer-events':'none',
     'cursor':'default'}).attr('disabled','disabled');
  
    function langButtonListen() {
      $('#switch-lang').click(function (event) {
        event.preventDefault();
        $('[lang="ja"]').toggle();
        $('[lang="en"]').toggle();
        // Switch cookie stored language.
        if ($.cookie('lang') === 'en') {
          $.cookie('lang', 'ja', { expires: 7 });
        } else {
          $.cookie('lang', 'en', { expires: 7 });
        }
      });
      // Enable lang switching button.
      $('#switch-lang').css({'pointer-events':'auto',
       'cursor':'pointer'}).removeAttr('disabled');
    }
  
    // Check if language cookie already exists.
    if ($.cookie('lang')) {
      var lang = $.cookie('lang');
      if (lang === 'en') {
        $('[lang="ja"]').hide();
        langButtonListen();
      } else {
        $('[lang="en"]').hide();
        langButtonListen();
      }
    } else {
      // no cookie set, so detect language based on location.
      if ("geolocation" in navigator) {
        // geolocation is available
        navigator.geolocation.getCurrentPosition(function (position) {
          // accepted geolocation so figure out which country
          var lat = position.coords.latitude,
              lng = position.coords.longitude;
          $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true', null, function (response) {
            var country = response.results[response.results.length-1].formatted_address;
            if (country ===  'Japan' || country === 'Vietnam') {
              $('[lang="en"]').hide();
              $.cookie('lang', 'ja', { expires: 5 });
              langButtonListen();
            } else {
              $('[lang="ja"]').hide();
              $.cookie('lang', 'en', { expires: 5 });
              langButtonListen();
            }
          }).fail(function (err) {
            console.log('error: '+err);
            $('[lang="ja"]').hide();
            $.cookie('lang', 'en', { expires: 5 });
            langButtonListen();
          });
        },
        function (error) {
          if (error.code == error.PERMISSION_DENIED) {
            
            $('[lang="ja"]').hide();
            $.cookie('lang', 'en', { expires: 5 });
            langButtonListen();
          } else {
            console.log('Unknown error. Defaulting to English!');
            $('[lang="ja"]').hide();
            $.cookie('lang', 'en', { expires: 5 });
            langButtonListen();
          }
        });
      } else {
        
        $('[lang="ja"]').hide();
        $.cookie('lang', 'en', { expires: 7 });
        langButtonListen());
      }
    }
  });