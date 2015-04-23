$(function(){

  var socket = io();
	// getting the id of the room from the url
	var chimpad_pad_id = Number(window.location.pathname.match(/\/pad\/(\d+)$/)[1]);

	$.ajax
  	({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: "/get_pad",
      //json object to sent to the authentication url
      data : {
      pad_id : chimpad_pad_id
    } }).done(function(raw_data) {
      
      	var data = raw_data[0];
        $('#pad_title').html(data['title']);
        $('#pad_content').val(data['content']);
        $('#pad_content_help_text').html('last modified: ' + timeSince(new Date(data['last_modified_timestamp'])));

  	});

  socket.on('connect', function(){
    socket.emit('load', chimpad_pad_id);
  });

    socket.on('message', function (data) {
      console.log(data);
        //var messages = [];
        if(data.message) {
            $('#pad_content').val(data.message);

        } else {
            console.log("There is a problem:", data);
        }
    });
 
    $("#pad_content").bind('keyup', function(){
       var text = $('#pad_content').val();
        socket.emit('send_message', { message: text });
    }); 

    $("#save_content_button").click(function(){
       var chimpad_pad_content = $('#pad_content').val();
        $.ajax
          ({
            type: "POST",
            //the url where you want to sent the userName and password to
            url: "/save_pad",
            //json object to sent to the authentication url
            data : {
            pad_id : chimpad_pad_id,
            pad_content : chimpad_pad_content
          } }).done(function(raw_data) {
            
              var data = raw_data[0];
              location.reload();
          });

    }); 

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        if (Math.floor(seconds) < 5) {
          return "just now";
        }
        return Math.floor(seconds) + " seconds ago";
    }

});
