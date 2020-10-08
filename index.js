const express = require('express')
const app = express()

const http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render('index')
})

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         });
// });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 5000

// app.listen(PORT,()=>{
//     console.log('Server has started')
// })

http.listen(PORT, ()=>{
    console.log('Server started')
})