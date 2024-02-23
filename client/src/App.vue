<template>
  <IntroScene v-if="introScene"/>
  <LobbyScene v-if="lobbyScene"/>
  <GameScene v-if="gameScene"/>
</template>

<script>

import IntroScene from "@/Scene/intro/IntroScene.vue";
import LobbyScene from "@/Scene/lobby/LobbyScene.vue";
import GameScene from "@/Scene/game/GameScene.vue";
import AppManager from "@/manager/AppManager";

export default {
  name: 'App',
  components: {
    GameScene,
    LobbyScene,
    IntroScene

  },
  created() {
    this.init()
  },
  data() {
    return {
      // js
      manager: new AppManager(),

      // view
      introScene: true,
      lobbyScene: false,
      gameScene: false
    }
  },
  methods: {
    async init() {

    }
  }
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
canvas, #app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#app {
  pointer-events: none;
}
</style>
