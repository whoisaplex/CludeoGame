import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import LobbyMain from '@/components/Lobby/LobbyMain'
import GameMain from '@/components/Game/GameMain'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Lobby/:id',
      name: 'LobbyMain',
      component: LobbyMain
    },
    {
      path: '/Game/:id',
      name: 'GameMain',
      component: GameMain
    }
  ],
  mode: 'history'
})
