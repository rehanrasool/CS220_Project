$(function(){

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
        $('#pad_content_help_text').html('last modified: ' + data['last_modified_timestamp']);

  	});


    var messages = [];
    var socket = io.connect('http://localhost:8080');
    var padContent = document.getElementById("pad_content");
    var sendButton = document.getElementById("save_pad_content");
    var content = document.getElementById("content");
    var name = global.user_id;
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            padContent.innerHTML = html;

        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = sendMessage = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = padContent.value;
            socket.emit('save_pad_content', { message: text, username: name });
        }
    };



});
