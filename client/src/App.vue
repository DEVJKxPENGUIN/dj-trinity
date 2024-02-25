<template>
  <IntroScene v-if="introScene"/>
  <LobbyScene v-if="lobbyScene"/>
  <GameScene v-if="gameScene"/>
</template>

<script>

import IntroScene from "@/scene/intro/IntroScene.vue";
import LobbyScene from "@/scene/lobby/LobbyScene.vue";
import GameScene from "@/scene/game/GameScene.vue";
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
      currentScene: null,
      introScene: false,
      lobbyScene: false,
      gameScene: false
    }
  },
  methods: {
    async init() {
      this.manager.changeScene('intro')
      this.introScene = true
    },
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Anta&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Anta&family=Orbitron:wght@400..900&display=swap');


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
  display: flex;
}

.anta-regular {
  font-family: "Anta", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.orbitron-regular {
  font-family: "Orbitron", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: normal;
}
</style>
