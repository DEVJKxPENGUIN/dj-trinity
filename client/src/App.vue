<template>
  <div class="topBar"></div>
  <IntroScene v-if="introScene"/>
  <LobbyScene v-if="lobbyScene"/>
  <GameScene v-if="gameScene"/>
  <SystemPopup v-if="isSystemPopup" class="z-10" />
</template>

<script>

import IntroScene from "@/scene/intro/IntroScene.vue";
import LobbyScene from "@/scene/lobby/LobbyScene.vue";
import GameScene from "@/scene/game/GameScene.vue";
import AppManager from "@/manager/AppManager";
import SystemPopup from "@/scene/common/SystemPopup.vue";
import {mapState} from "vuex";

export default {
  name: 'App',
  components: {
    SystemPopup,
    GameScene,
    LobbyScene,
    IntroScene

  },
  computed: {
    ...mapState(['isSystemPopup'])
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

.topBar {
  position: fixed;
  height: 40px;
  width: 100%;
  -webkit-app-region: drag;
}

canvas, #app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

canvas {
  z-index: -1;
  pointer-events: none;
}

#app {
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
.orbitron-thin {
  font-family: "Orbitron", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}
</style>
