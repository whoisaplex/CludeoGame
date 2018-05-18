const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const PORT = process.env.PORT || 5000;

const GameDetails = require('./test')


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
  socketConnections[socket.id] = {socket: socket};
  let _Lobby = ''
  sendLobbies();

  socket.on('setPlayerName', data => {
    socketConnections[socket.id].name = data;
  });

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
    sendLobbies();
    socket.emit('JoinedLobby', data);
  });

  socket.on('startgame', (data) => {
    LobbyPositionArray[socket.id] = data;
    const GameObject = GameDetails.gameFunctions.giveCharacters(data);
    Games[socket.id] = GameObject;
    let _HostPlayer = '';
    data.forEach((player, index) => {
      if(Games[socket.id].Players[index].PlayerID === socket.id){
        _HostPlayer = Games[socket.id].Players[index];
        Games[socket.id].Players[index].playersTurn = true;
      }
    });
    io.sockets.in(_Lobby).emit('sendGetPlayerData', {findingIdentification: socket.id, playerPlaying: {ID: _HostPlayer.PlayerID, NAME: _HostPlayer.PlayerName}});
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

  socket.on('GetPlayerData2', (data) => {
    let tempIndex = 0;
    let tempPlayerNamesTurn;
    Games[data].Players.forEach((player, index) => {
      if(player.PlayerID === socket.id) tempIndex = index;
      if(player.playersTurn === true) tempPlayerNamesTurn = player.PlayerName;
    });
    socket.emit('ReturnOfPlayerData2', Games[data].Players[tempIndex].playersTurn);
    socket.emit('changeWhoIsPlaying', {NAME: tempPlayerNamesTurn});
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

  socket.on('PlayersTurnSendingCards', (data) => {
    const newRoundPlayersArray = GameDetails.gameFunctions.PlayersWhoHasCards(data, Games[data.HostID].Players);
    Games[data.HostID].CurrentRoundPlayers = newRoundPlayersArray;
    if(Games[data.HostID].CurrentRoundPlayers.length > 0){
      const firstPlayerID = Games[data.HostID].CurrentRoundPlayers[0].PlayerID;
      socket.broadcast.to(firstPlayerID).emit('questioning', {Senderid: data.Senderid, HostID: data.HostID, Cards: newRoundPlayersArray[0].PlayerCards});
    }else{
      let playerIndex = 0;
      Games[data.HostID].Players.forEach((player, index) => {
        if(player.PlayerID === socket.id){
          player.playersTurn = false;
          playerIndex = index;
        }
      });
      if(Games[data.HostID].Players.length - 1 > playerIndex){
        Games[data.HostID].Players[playerIndex + 1].playersTurn = true;
      }else{
        Games[data.HostID].Players[0].playersTurn = true;
      }
      io.sockets.in(_Lobby).emit('PlayerUpdateData', {HostID: data.HostID});
    }
  });

  socket.on('getSentCard', data => {
    Games[data.HostID].CurrentRoundPlayers.shift();
    socket.broadcast.to(data.senderID).emit('SendGottenCard', {HostID: data.HostID, Cards: data.Card});
  });

  socket.on('ConfirmedCardNext', data => {
    if(Games[data.HostID].CurrentRoundPlayers.length > 0){
      //Keep asking players for cards
      socket.broadcast.to(Games[data.HostID].CurrentRoundPlayers[0].PlayerID).emit('questioning', {Senderid: data.senderID, HostID: data.HostID, Cards: Games[data.HostID].CurrentRoundPlayers[0].PlayerCards});
    }else{
      //Players turn is over, go to next player.
      let playerIndex = 0;
      Games[data.HostID].Players.forEach((player, index) => {
        if(player.PlayerID === socket.id){
          player.playersTurn = false;
          playerIndex = index;
        }
      });
      if(Games[data.HostID].Players.length - 1 > playerIndex){
        Games[data.HostID].Players[playerIndex + 1].playersTurn = true;
      }else{
        Games[data.HostID].Players[0].playersTurn = true;
      }
      io.sockets.in(_Lobby).emit('PlayerUpdateData', {HostID: data.HostID});
    }
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
    return {LobbyName: lobby.lobbyName, LobbyCount: lobby.amount};
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
