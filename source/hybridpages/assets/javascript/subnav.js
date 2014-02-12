$(document).ready(function() {
  var navpos = $('#mainsubnav').offset();
  console.log(navpos.top);
    $(window).bind('scroll', function() {
      if ($(window).scrollTop() > navpos.top) {
        $('#mainsubnav').addClass('subNavfixed');
        $('#HowToConnect, #HowToUse, #Commands, #Events, #Circuit, #Compatability,#SpheroColors').addClass('marginTopSubnav');
       }
       else {
         $('#mainsubnav').removeClass('subNavfixed');
         $('#HowToConnect, #HowToUse, #Commands, #Events, #Circuit, #Compatability,#SpheroColors').removeClass('marginTopSubnav');
         $("#mainsubnav a").removeClass("active");
       }
    });

    $("#mainsubnav a").click(function(){
      $("#mainsubnav a").removeClass("active");
      $(this).addClass("active");
    });

});