const express = require('express')
const app = express()
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 4)
const http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    // res.render('index')
    res.redirect(`/${nanoid()}`)
})

app.get('/:room',(req,res)=>{
    res.render('index',{roomId:req.params.room})
})

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         });
// });

var numClients = {};

io.on('connection', (socket) => {

    socket.on('join-room',(roomId,userId)=>{
        if (numClients[roomId] === undefined) {
            numClients[roomId] = 1;
        } else {
            numClients[roomId] = numClients[roomId]+1;
        }
        console.log(numClients)
        io.to(roomId).emit('new peer',numClients[roomId])
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    })

    socket.on('chat message', (msg,roomId) => {
        console.log('message: ' + msg); 
        io.to(roomId).emit('chat message', msg);
      });

    socket.on('disconnect', (roomId) => {
        numClients[roomId]--;
        io.to(roomId).emit('new peer',numClients[roomId])
        console.log('user disconnected');
    });   
});

const PORT = process.env.PORT || 5000

// app.listen(PORT,()=>{
//     console.log('Server has started')
// })

http.listen(PORT, ()=>{
    console.log('Server started')
})