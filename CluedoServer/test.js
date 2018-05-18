const Characters = [
  {item: 'Mrs. White', type: 'Character'},
  {item: 'Mr. Green', type: 'Character'},
  {item: 'Mrs. Peacock', type: 'Character'},
  {item: 'Professor Plum', type: 'Character'},
  {item: 'Miss Scarlet', type: 'Character'},
  {item: 'Colonel Mustard', type: 'Character'}
];

const Weapons = [
  {item: 'Candlestick', type: 'Weapon'},
  {item: 'Iron Pipe', type: 'Weapon'},
  {item: 'Wrench', type: 'Weapon'},
  {item: 'Gun', type: 'Weapon'},
  {item: 'Rope', type: 'Weapon'},
  {item: 'Dagger', type: 'Weapon'}
];

const Rooms = [
  {item: 'Living Room', type: 'Room'},
  {item: 'Dining Room', type: 'Room'},
  {item: 'Library', type: 'Room'},
  {item: 'Billiard Room', type: 'Room'},
  {item: 'Kitchen', type: 'Room'},
  {item: 'Hall', type: 'Room'},
  {item: 'Gallery', type: 'Room'},
  {item: 'Study', type: 'Room'},
  {item: 'Lounge', type: 'Room'}
];

const gameFunctions = {
  giveCharacters: function(character_data){
    let _GameObject = {};
    _GameObject.HostID = character_data[0].clientid;
    const numb = this.GetRandomNumbers();
    _GameObject.mystery = {
      Character: Characters[numb[0]],
      Weapon: Weapons[numb[1]],
      Room: Rooms[numb[2]]
    };
    _GameObject.Cards = this.GetCards(numb);
    _GameObject.Players = this.setPlayers(character_data, _GameObject.Cards);
    return _GameObject;
  },
  GetRandomNumbers: function(){
    const num1 = Math.floor(Math.random() * 6);
    const num2 = Math.floor(Math.random() * 6);
    const num3 = Math.floor(Math.random() * 9);
    let arr = [];
    arr.push(num1, num2, num3);
    return arr;
  },
  GetCards: function(numbers){
    let tempChars = Characters;
    let tempWeapons = Weapons;
    let tempRooms = Rooms;
    tempChars.splice(numbers[0], 1);
    tempWeapons.splice(numbers[1], 1);
    tempRooms.splice(numbers[2], 1);

    let tempCardArray = [];
    tempChars.forEach(char => {
      tempCardArray.push(char);
    });
    tempWeapons.forEach(weap => {
      tempCardArray.push(weap);
    });
    tempRooms.forEach(room => {
      tempCardArray.push(room);
    });
    tempCardArray.sort(function() { return 0.5 - Math.random() });
    return tempCardArray;
  },
  setPlayers: function(character_data, cards){
    let TempPlayerArray = [];
    let TempCardsArray = cards;
    character_data.forEach((player, index) => {
      TempPlayerArray.push({PlayerID: player.clientid, CharacterID: Characters[index], PlayerName: player.playerName, PlayerCards: TempCardsArray.slice(0, 3), playersTurn: false});
      TempCardsArray.splice(0, 3);
    });
    return TempPlayerArray;
  },

  PlayersWhoHasCards: function(data, players){
    let newArray = this.RemoveSenderIdFromArray(data.Senderid, players)
    let PepoleToQustion = this.WhatPlayersShouldGetQuestion(data.Cards.Character, data.Cards.Weapon, data.Cards.Room, newArray);
    return PepoleToQustion;
  },
  RemoveSenderIdFromArray(senderid, players){
    return players.filter(player => {
      if(player.PlayerID !== senderid){
        return true;
      }else{
        return false;
      }
    });
  },
  WhatPlayersShouldGetQuestion(_character, _weapon, _room, players){
    return players.filter(player => {
      let hasCard = false;
      let indexs = [];

      player.PlayerCards.forEach((card, index, object) => {
        if(card.item === _character){
          hasCard = true;
        }else{
          if(card.item === _weapon){
            hasCard = true;
          }else{
            if(card.item === _room){
              hasCard = true;
            }else{
              indexs.push(index);
            }
          }
        }
      });
      indexs.reverse();
      indexs.forEach(item => {
         player.PlayerCards.splice(item, 1);
      });

      return hasCard;
    });
  }
}

module.exports = {Characters, Weapons, Rooms, gameFunctions};
