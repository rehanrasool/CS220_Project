$(function(){

  var socket = io();
	// getting the id of the room from the url
	var chimpad_pad_id = Number(window.location.pathname.match(/\/pad\/(\d+)$/)[1]);
  var messages=[];
  var editor = ace.edit("pad_content");

    $.ajax
      ({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: "/get_languages",
        //json object to sent to the authentication url
        data : {
        pad_id : chimpad_pad_id
      } }).done(function(raw_data) {
        
          var data = raw_data;

          $.each( data, function( key, value ) {
            //alert( key + ": " + value );
            $('#pad_language_options').append($("<option></option>").attr("value",value['value']).text(value['name']));
          });

      });

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
        //$('#pad_content').html(data['content']);
        $('#pad_content_last_modified_timestamp').html('last modified: ' + moment(new Date(data['last_modified_timestamp'])).fromNow());
        $('#pad_content_last_modified_user').html('last modified by : <a href="..\\user\\' + data['last_modified_user'] + '">' + data['username'] + '</a>');


        $("#pad_language_options").val(data['lang']);

        editor.setValue(data['content']);
        editor.getSession().setMode("ace/mode/" + $("#pad_language_options").val());


    });

    $( "#pad_language_options" ).change(function() {
        socket.emit('change_mode', { mode: $("#pad_language_options").val() });
        editor.getSession().setMode("ace/mode/" + $("#pad_language_options").val());
    });

    function get_messages () {
      $.ajax
      ({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: "/get_messages",
        //json object to sent to the authentication url
        data : {
        pad_id : chimpad_pad_id
      } }).done(function(raw_data) {
        
          var data = raw_data;
          var html = '';
          var messenger= $('#pad_messages');


          for(var i=0;i<data.length;i++) {
            html+='<div class=\"col-lg-6\"><strong>' + data[i].user_name + '</strong></div><div class=\"col-lg-6 text-right\">' + moment(new Date(data[i].time_stamp)).fromNow() + '</div><div class=\"col-lg-12\">' + data[i].message_text + '</div><div class=\"col-lg-12\">&nbsp;</div>';
            //data[i].user_name+": "+data[i].message_text+"\n";
          }
          messenger.html(html);
          messenger.animate({ scrollTop: messenger[0].scrollHeight}, 1000);
          //location.reload();
      });
    }

  get_messages();

  socket.on('connect', function(){
    socket.emit('load', chimpad_pad_id);
  });

    socket.on('pad_content_sent', function (data) {
      console.log(data);
        //var messages = [];
        if(data.message) {
             editor.setValue(data.message);

        } else {
            console.log("There is a problem:", data);
        }
    });
 
    $("#pad_content").bind('keyup', function(){
       var text =  editor.getValue();
        socket.emit('pad_content_send', { message: text });
    }); 
     
     //Added functions
    socket.on('messenger_sent',function (data){
      var messenger= $('#pad_messages');
      var html = '';

      get_messages();
    });

    socket.on('mode_changed',function (data){
      editor.getSession().setMode("ace/mode/" + data.mode);
      $("#pad_language_options").val(data.mode);
    });

    //Adding send message functionality to it 
    $('#send_message_button').click(function(){
      var message_text=$('#pad_input_message').val();
      $('#pad_input_message').val('');
      socket.emit('messenger_send',{message:message_text});

      $.ajax
        ({
          type: "POST",
          //the url where you want to sent the userName and password to
          url: "/send_message",
          //json object to sent to the authentication url
          data : {
          pad_id : chimpad_pad_id,
          message_content : message_text
        } }).done(function(raw_data) {
          
            var data = raw_data[0];
            //location.reload();
        });

    });



    $("#save_content_button").click(function(){
       var chimpad_pad_content = editor.getValue();
       var chimpad_pad_language = $("#pad_language_options").val();

       if (chimpad_pad_language == 'http') {
          chimpad_pad_language = 'none';
       }

        $.ajax
          ({
            type: "POST",
            //the url where you want to sent the userName and password to
            url: "/save_pad",
            //json object to sent to the authentication url
            data : {
            pad_id : chimpad_pad_id,
            pad_content : chimpad_pad_content,
            pad_language : chimpad_pad_language
          } }).done(function(raw_data) {
            
              var data = raw_data[0];
              
              //location.reload();
          });

    }); 

    

    

});
