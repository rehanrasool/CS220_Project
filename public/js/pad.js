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
        $('#pad_content_last_modified_timestamp').html('last modified: ' + moment(new Date(data['last_modified_timestamp'])).fromNow());
        $('#pad_content_last_modified_user').html('last modified by : <a href="">' + data['last_modified_user'] + '</a>');

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
     //Added functions
    socket.on('text',function(data){
      console.log(data);
      if(data.message){
        $('#pad_messages').val(data.message);
      }
      else {
        console.log("There is a problem:",data);
      }
    });
    // $('#pad_messages').bind('keyup',function(){
    //   var text=$('#pad_messages').val();
    //   socket.emit('messenger_send',{message:text});
    // });
    //Adding send message functionality to it 
    $('#send_message_messenger').click(function(){
      var text=$('#pad_input_message').val();
      socket.emit('messenger_send',{message : text});
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

});
