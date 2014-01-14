(function(){

	var socket = io.connect(window.location.host)

	socket.on('connect', function(){
		var roomName = window.location.pathname,
			username = getUserName()
		
		socket.emit('adduser', roomName, username)
	})
	
	function getUserName(){
		var username = $.cookie("username"); 
		
		if (username !== undefined) return username
		
		//Get username no matter what
		while ( ! username ){
			username = prompt("What's your name?")
		}
		
		$.cookie("username", username)
		return username
	}

	socket.on('updatechat', function (username, data) {
		writeMessage(username, data)
		$.titleAlert('You have new messages!', { requireBlur: false });
	})

	socket.on('updateusers', function(data) {
		$('#users').empty()
		$.each(data, function(key, value) {
			$('#users').append('<div>' + value + '</div>')
		})
	})
	
	function writeMessage(username, message){
		$('#conversation').prepend('<span class="username">' + username + ' (' + moment().format('HH:mm:ss') + '):</span> <span class="message">' + message + '<span><br />')
	}

	$(function(){
		$('#datasend').click( function() {
			var message = $('#data').val()
			if (! message) return false;
			$('#data').val('')
			socket.emit('sendchat', message)
			writeMessage(getUserName(), message)
		})

		// when the client hits ENTER on their keyboard
		$('#data').keypress(function(e) {
			if(e.which == 13) {
				$('#datasend').click()
				e.preventDefault()
			}
		})
	})
	
	window.changeUsername = function(){
		$.removeCookie('username')
		window.location.reload()
	}
	
}())
