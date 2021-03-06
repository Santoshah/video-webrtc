const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);
const {v4 : uuidV4 } = require('uuid');

app.set("view engine", "ejs");
app.use(express.static('public'))

// you can define any path but it can be change. it will simply create new room when particular route is hit
app.get("/", (req, res)=>{
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res)=>{
    res.render('room', {roomId: req.params.room})
    // eg: roomId : '06831989-bb8e-4bb9-84b4-ae262593f60c'
})

io.on('connection', socket=>{
    socket.on('join-room', (roomId, userId)=>{
        console.log(roomId, userId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        // remove video if window closed.
        socket.on('disconnect', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })


})

server.listen(3000);