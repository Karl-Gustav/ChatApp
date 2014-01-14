var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	PORT = 9999
require('sugar')

server.listen(PORT)

app.configure(function(){
	app.use(express.static(__dirname + '/frontend'))
})

app.get('/get/rooms', function (req, res) {
	var rooms = Object.keys(io.sockets.manager.rooms),
		roomsWithoutEmpys = rooms.compact(true),
		roomsWithoutSlash = roomsWithoutEmpys.map(function(room){ 
			return room.remove(/\//g)
		})
		
	res.json(roomsWithoutSlash)
})

app.get('/:roomId', function (req, res) {
	res.sendfile(__dirname + '/frontend/chatroom.html')
})

io.sockets.on('connection', function (socket) {

	socket.on('sendchat', function (message) {
		socket.broadcast.to(socket.room).emit('updatechat', socket.username, message)
	})

	socket.on('adduser', function(room, username){
		room = room.toLowerCase()
		socket.join(room)
		socket.room = room
		socket.username = username
		io.sockets.in(room).emit('updateusers', io.sockets.clients(room).map('username'))
	})

	socket.on('disconnect', function(){			
		var sockets = io.sockets.clients(socket.room)
			socketsExceptThis = sockets.exclude(function(el){return el.id == socket.id})
			usersExceptThis = socketsExceptThis.map('username')

		io.sockets.in(socket.room).emit('updateusers', usersExceptThis)
	})
})

console.log('Server started at localhost port', PORT)
