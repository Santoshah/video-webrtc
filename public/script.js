const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/',
    post : '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true;

// it will share screen
// getDisplayMedia
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream=>{
    addVideoStream(myVideo, stream);

    myPeer.on('call', call=>{
        call.answer(stream);
        const video = document.createElement('video')
        call.on('stream', (userVideoStream)=>{
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on("user-connected", userId=>{
        connectToNewuser(userId, stream)
    });

})

// peerjs --port 443 (run this command at 443 because at 3001 it not connecting.)
console.log(myPeer);
myPeer.on('open', userId=>{
    socket.emit('join-room', ROOM_ID, userId)
})

// socket.on('user-connected', userId=>{
//     console.log("User connected "  + userId)
// })

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
}
function connectToNewuser(userId, stream){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video');
    call.on('stream', userVideoStream=>{
        addVideoStream(video, userVideoStream);
    })
    call.on("close", ()=>{
        video.remove();
    })
}