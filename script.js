
var request_url = "http://www.bbc.co.uk/tv/programmes/genres.json";

function retrieveGenres(){
  $.ajax({
    url: request_url,
    dataType: 'json',
    beforeSend: function(){
    }
  }).done(function(data){

  $.each(data.categories, function(i, item){//object.key will return the array .each is expecting
    $('#genres').append("<li id='" + item.key + "'>" + item.title + "</li>");
  });
  }).fail(function(){
    console.log("Your call failed");
  }
  ).always(function(){
    //
  });
}

function getTomorrowsSchedule(genre){
  $.ajax({
      url: "http://www.bbc.co.uk/tv/programmes/genres/" + genre + "/schedules/tomorrow.json",
      dataType: 'json',
      beforeSend: function(){
        $("#programmes").empty();
        $("#programmes").append("<div class='spinner'><img src='spinner.gif' /></div>");
      }
    }).done(function(data) {
      $('.spinner').remove();
        $.each(data.broadcasts, function(i, show){
          $("#programmes").append(processEpisode(show));
        });
      }).fail(function() {
        console.log("Request failed.");
      }).always(function() {
    });

}

function processEpisode(show){
  item_html = "<li><h2>" + show.programme.display_titles.title + "</h2>";
  item_html += "<h3>" + show.programme.short_synopsis + "</h3>";
  if(show.programme.image){
    item_html += "<img src=http://ichef.bbci.co.uk/images/ic/272x153/" + show.programme.image.pid  + ".jpg />";
  }
  else{
    item_html += "<img src='http://placehold.it/272x153' />";
  }
  item_html += "<p>"+ formatDate(show.start, show.end) + "</p>";
  item_html += "<p><strong>Duration:</strong> " + show.duration/60+ " minutes</p>";
  item_html += "<span class='service'>" + show.service.title + "</span></li>";

item_html += "</li>";
  return item_html;
}



function formatDate(start, end) {

    var start_date = new Date(start);
    var end_date = new Date(end);

    var day = start_date.getDate();
    var month = start_date.getMonth() + 1; // the returned months are 0-11
    var year = start_date.getFullYear();

    var start_hour = start_date.getHours();
    var start_mins = start_date.getMinutes();

    var end_hour = end_date.getHours();
    var end_mins = end_date.getMinutes();

    var date = day + "/" + month + "/" + year + " ";

    // add leading 0 and return last two characters to make sure we use 00:00 format
    date +=  ("0"+start_hour).slice(-2) + ":" + ("0"+start_mins).slice(-2) + " - " +
        ('0' + end_hour).slice(-2) + ":" +  ( "0" + end_mins).slice(-2);

    return date;
}

$(document).ready(function(){
  $(document).on('click', '#genres li', function(e){
    genre = $(this).attr('id');
    $("#genres li").removeClass('active');
    $(this).addClass('active');

  getTomorrowsSchedule(genre);
  })

  retrieveGenres();
});
