const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const PORT = process.env.PORT || 5000;

const GameDetails = require('./test')
//console.log(GameDetails.gameFunctions.giveCharacters())

let socketConnections = [];
let Lobbies = [];
let Games = [];

let LobbyPositionArray = [];

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.listen(PORT);

app.get('/', (req, res) => {
  res.send('Hello world');
});

io.on('connection', function (socket) {
  socketConnections[socket.id] = {socket: socket, name: 'Aplex'};
  let _Lobby = ''
  sendLobbies();

  socket.on('CreateLobby', (data) => {
    socket.join(data);
    _Lobby = data;
    socketConnections[socket.id]._Lobby = data;
    socketConnections[socket.id]._LobbyStatus = false;
    Lobbies.push({socketid: socket.id, lobbyName: data, amount: 1});
    socket.emit('ChangeToLobby', _Lobby);
    sendNewLobbyMember(_Lobby);
    sendLobbies();
  });

  socket.on('JoinLobby', (data) => {
    socket.join(data);
    Lobbies.forEach(Lobby => {
      if(Lobby.lobbyName === data) Lobby.amount += 1;
    });
    _Lobby = data;
    socketConnections[socket.id]._Lobby = data;
    socketConnections[socket.id]._LobbyStatus = false;
    sendNewLobbyMember(data);
  });

  socket.on('startgame', (data) => {
    LobbyPositionArray[socket.id] = data;
    const GameObject = GameDetails.gameFunctions.giveCharacters(data);
    console.log(GameObject.mystery);
    data.forEach((player, index) => {
      if(GameObject.Players[index].PlayerID === socket.id){
        socket.emit('PlayerData', GameObject.Players[index]);
      }
    });
    Games[socket.id] = GameObject;
    io.sockets.in(_Lobby).emit('sendGetPlayerData', {findingIdentification: socket.id});
  });

  socket.on('GetPlayerData', (data) => {
    let YourPositionArray = LobbyPositionArray[data];
    let YourCardInformationObject = Games[data];
    let yourPositon;
    YourPositionArray.forEach(player =>{
      if(player.clientid === socket.id) yourPositon = player.playerPosition;
    });
    socket.emit('ReturnOfPlayerData', YourCardInformationObject.Players[yourPositon]);
  });

  socket.on('LobbyCheck', (data) => {
    if(_Lobby !== data){
      Lobbies.forEach(Lobby => {
        if(Lobby.lobbyName === data){
          if(Lobby.amount < 6){
            socket.join(data);
            Lobby.amount += 1;
            sendNewLobbyMember(data);
            socketConnections[socket.id]._Lobby = data;
            socketConnections[socket.id]._LobbyStatus = false;
            socket.emit('LobbyCheckStatus', {didPass: true, error: null, gameOwner: false});
          }else{
            socket.emit('LobbyCheckStatus', {didPass: false, error: 'Lobby is full', gameOwner: false});
          }
        }
      });
    }else{
      let foundGameOwner = false;
      Lobbies.forEach(Lobby => {
        if(Lobby.socketid === socket.id) foundGameOwner = true;
      });
      if(foundGameOwner){
        socket.emit('LobbyCheckStatus', {didPass: true, error: null, gameOwner: true});
      }else{
        socket.emit('LobbyCheckStatus', {didPass: true, error: null, gameOwner: false});
      }
    }
  });

  socket.on('changeStatus', () => {
    socketConnections[socket.id]._LobbyStatus = !socketConnections[socket.id]._LobbyStatus;
    sendNewLobbyMember(socketConnections[socket.id]._Lobby);
  });

  socket.on('disconnect', (reason) => {
    Object.keys(socketConnections).forEach(key => {
      if(socketConnections[key].socket.connected === false){
        Lobbies.forEach((lobby, index) => {
          if(lobby.socketid === socketConnections[key].socket.id) Lobbies.splice(index, 1);
        });
        sendNewLobbyMember(socketConnections[key]._Lobby);
        sendLobbies();
        delete socketConnections[socketConnections[key].socket.id];
      }
    });
  });
});

function sendLobbies(){
  tempLobb = Lobbies.map(lobby => {
    return lobby.lobbyName;
  });
  io.sockets.emit('AllLobies', tempLobb);
}

function sendNewLobbyMember(Lobby){
  io.of('/').in(Lobby).clients(function(error, clients){
    let LobbyUsers = clients.map(client => {
      return {clientid: client, playerName: socketConnections[client].name, playerLobbyStatus: socketConnections[client]._LobbyStatus};
    });
    io.sockets.in(Lobby).emit('Lobby', LobbyUsers);
  });
}
