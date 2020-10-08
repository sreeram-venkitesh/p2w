let text = document.getElementById('text');
let peopleCount = document.getElementById('peopleCount')

var socket = io('/');

const name = prompt('Enter your name')

socket.emit('join-room',roomId,name)

socket.on('user-connected',(userId)=>{
  console.log('User joined : ',userId)
})

text.addEventListener('keyup',()=>{
  socket.emit('chat message', $('#text').val(), roomId);
  return false;
})

socket.on('chat message', function(msg){
    text.value = String(msg);
});

socket.on('new peer', (number)=>{
    console.log('New person joined, total : ',number)
    peopleCount.innerText = `People online : ${number}`;
})