(function (){

	var $roomsList = $("#roomsList")

	$.get("/get/rooms", function(rooms){
		$.each(rooms, function(key, room){
			$roomsList.append('<li><a href="/'+ room +'">'+ room +'</a></li>')
		})
	});

	window.goToNewRoom = function(){
		window.location = $('#newRoom').val()
		return false;
	}

	window.getExampleUrl = function(){
		var url = "http://" + window.location.host + "/YourRoomNameHere"	
		return '<a href="' + url + '">' + url + '</a>'
	}
	$('#exampleUrl').html(getExampleUrl())
	
}())
