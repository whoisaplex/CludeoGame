<template>
  <div>
      <div class="Characters-container">
        <h1 class="Accusation-title">Characters</h1>
        <p class="chosen-card">Chosen card: <span>{{Guess.Character}}</span></p>
        <div class="cards-holder">
          <div v-for="(Character, index) in RemoveYourOwn(this.gameData.Characters)" @click="setCharacter(Character.item, index)" class="Character">
            <p for="Character.item">{{Character.item}}</p>
          </div>
        </div>
      </div>

      <div class="Characters-container">
        <h1 class="Accusation-title">Weapons</h1>
        <p class="chosen-card">Chosen card: <span>{{Guess.Weapon}}</span></p>
        <div class="cards-holder">
          <div v-for="Weapons in RemoveYourOwn(this.gameData.Weapons)" @click="setWeapon(Weapons.item)" class="Character">
            <p for="Weapons.item">{{Weapons.item}}</p>
          </div>
        </div>
      </div>

      <div class="Characters-container">
        <h1 class="Accusation-title">Rooms</h1>
        <p class="chosen-card">Chosen card: <span>{{Guess.Room}}</span></p>
        <div class="cards-holder">
          <div v-for="Rooms in RemoveYourOwn(this.gameData.Rooms)" @click="setRoom(Rooms.item)" class="Character">
            <p for="Rooms.item">{{Rooms.item}}</p>
          </div>
        </div>
      </div>
      <div v-if="playerHasTurn" class="button-holders">
        <button @click="makeGuess()">Make Guess</button>
        <button @click="makeAccusation()">Make Accusation</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'AccusationTab',
  props: ['gameData', 'playerData', 'playerHasTurn', 'HostId'],
  data() {
    return {
      Guess: {Character: '', Weapon: '', Room: ''},
      isTurn: this.playerHasTurn,
      hasClicked: false
    }
  },
  methods:{
    RemoveYourOwn(items){
       return items.filter(this.isYourCard);
    },
    isYourCard(card){
      let notFoundCard = true;
      this.playerData.forEach(playerCard => {
        if(playerCard.item === card.item) notFoundCard = false;
      });
      return notFoundCard;
    },
    setCharacter(Char, index){
      this.Guess.Character = Char;
    },
    setWeapon(Char){
      this.Guess.Weapon = Char;
    },
    setRoom(Char){
      this.Guess.Room = Char;
    },
    makeGuess(){
      let foundEmpty = false;
      let tempArray = [this.Guess.Character, this.Guess.Weapon, this.Guess.Room];
      tempArray.forEach(item => {
        if(item === '') foundEmpty = true;
      });
      if(foundEmpty){
        console.log('Not everything is filled in')
      }else{
        this.$socket.emit('PlayersTurnSendingCards', {Senderid: this.$socket.id, HostID: this.HostId, Cards: this.Guess});
        this.hasClicked = true;
        this.Guess = {Character: '', Weapon: '', Room: ''};
      }
    },
    makeAccusation(){
      console.log('accusation')
    }
  }
}
</script>

<style>
  .button-holders{
    width:100%;
    margin-top:40px;
    display:flex;
    justify-content: space-around;
  }
  .button-holders button{
    width:calc(50% - 20px);
    padding:10px 0px;
    background:#D32F2F;
    border:none;
    color:white;
    font-weight: bold;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    cursor:pointer;
    outline:none;
  }
  .button-holders button:nth-child(odd){
    background:#4CAF50;
  }
  .cards-holder{
    display:flex;
    flex-wrap:wrap;
    margin-left:5px;
  }
  .Accusation-title{
    padding-left:10px;
    color:white;
  }
  .chosen-card{
    padding-left:10px;
    color:white;
  }
  .chosen-card span{
    color:#4CAF50;
  }
  .Characters-container{
    width:100%;
    min-height:10px;
    display:flex;
    flex-direction: column;
  }
  .Characters-container:first-of-type{
    padding-top:10px;
  }
  .Character{
    width:calc(33% - 12px);
    background:#2b2b2b;
    margin: 5px 5px;
    color:white;
    padding:10px 0px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    cursor:pointer;
    transition: border .4s;
    border:solid 1px #121212;
  }
  .Character:hover{
    border:solid 1px #4CAF50;
  }
  .Character p{
    padding-left:10px;
  }
  .Character button{
    margin-right:10px;
    padding:1px 10px;
    border:solid 2px #282828;
    background:#191919;
    color:white;
    outline:none;
    cursor:pointer;
  }


</style>
