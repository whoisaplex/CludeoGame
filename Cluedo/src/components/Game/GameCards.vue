<template>
  <div>
    <div v-for="card in Cards" class="full-card-container">
      <div class="card">
        <div class="card-text">
          <p>{{card.item}}</p>
        </div>
        <div class="card-img" :style="{'background-image' : 'url('+ getCardImg(card.item, card.type) +')'}"></div>
        <div class="card-text rotated">
          <p>{{card.item}}</p>
        </div>
      </div>
      <button v-if="isQuestioned" @click="sendPickedCard(card.item, card.type)">Show Card</button>
      <button v-if="showingGottenCard" @click="sendConfirmedCard">Confirm Card</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCards',
  props: ['Cards', 'gameData', 'isQuestioned', 'senderID', 'HostID', 'showingGottenCard'],
  data() {
    return {

    }
  },
  methods:{
    getCardImg(item, type){
      let imgurl;
      switch(type){
        case 'Character':
          this.gameData.Characters.forEach(char => {
            if(char.item === item){imgurl = char.url;}
          });
          break;
        case 'Room':
          this.gameData.Rooms.forEach(rooms => {
            if(rooms.item === item){imgurl = rooms.url;}
          });
          break;
        case 'Weapon':
          this.gameData.Weapons.forEach(weapon => {
            if(weapon.item === item){imgurl = weapon.url;}
          });
          break;
      }
      return imgurl;
    },
    sendPickedCard(card, type){
      this.$socket.emit('getSentCard', {senderID: this.senderID, HostID: this.HostID, Card: {item: card, type: type}});
      this.$emit('noLongerQuestioned');
    },
    sendConfirmedCard(){
      this.$socket.emit('ConfirmedCardNext', {senderID: this.$socket.id, HostID: this.HostID});
      this.$emit('hasConfirmed');
    }
  }
}
</script>

<style>
  .full-card-container{
    display:flex;
    flex-direction: column;
    align-items: center;
  }
  .full-card-container button{
    margin-top:10px;
    padding:10px 0px;
    width:calc(100% - 30px);
    border-radius:5px;
    border:none;
    background:#4CAF50;
    color:white;
    font-weight: bold;
    font-size:18px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    cursor:pointer;
  }
  .card{
    width:250px;
    height:350px;
    background:black;
    display:flex;
    flex-direction: column;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    transition: all .3s;
    margin: 0px 15px;
    cursor:pointer;
    border-radius: 10px;
    z-index:3;
    border:solid 2px rgba(0,0,0,0);
  }
  .card-img{
    height:230px;
    width:calc(100% - 80px);
    background:white;
    margin: 0px 40px;
  }
  .card-text{
    height:60px;
    display:flex;
    align-items: center;
  }
  .rotated{
    align-self: flex-end;
  }
  .card-text p{
    color:black;
    font-weight: bold;
    padding:5px 10px;
    background:white;
    border-radius: 0px 5px 5px 0px;
  }
  .rotated p{
    border-radius: 5px 0px 0px 5px;
  }

</style>
