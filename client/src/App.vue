<template>
  <LoadingScene />
  <div class="topBar"></div>
  <transition name="fade">
    <IntroScene v-if="introScene" @changeScene="changeScene"/>
  </transition>
  <transition name="fade">
    <LobbyScene v-if="lobbyScene"/>
  </transition>
  <transition name="fade">
    <GameScene v-if="gameScene"/>
  </transition>
  <transition name="slide-fade">
    <SystemPopup v-if="isSystemPopup" class="z-10"/>
  </transition>
</template>

<script>

import IntroScene from "@/scene/intro/IntroScene.vue";
import LobbyScene from "@/scene/lobby/LobbyScene.vue";
import GameScene from "@/scene/game/GameScene.vue";
import AppManager from "@/manager/AppManager";
import SystemPopup from "@/scene/common/SystemPopup.vue";
import {mapState} from "vuex";
import LoadingScene from "@/scene/common/LoadingScene.vue";

export default {
  name: 'App',
  components: {
    LoadingScene,
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
      introScene: false,
      lobbyScene: false,
      gameScene: false
    }
  },
  methods: {
    async init() {
      await this.manager.changeScene('introScene')
      this.introScene = true
    },
    async changeScene(nextScene) {
      this.closeScene()
      await this.manager.changeScene(nextScene)

      if (nextScene === 'introScene') {
        this.introScene = true
      } else if (nextScene === 'lobbyScene') {
        this.lobbyScene = true
      } else if (nextScene === 'gameScene') {
        this.gameScene = true
      }
      // todo ++
    },
    closeScene() {
      this.introScene = false
      this.lobbyScene = false
      this.gameScene = false
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

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0;
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
</style>
