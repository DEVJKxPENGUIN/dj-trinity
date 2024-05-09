<template>
  <div>

  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import * as authenticationManager from "@/manager/authenticationManager";
import GameCanvas from "@/scene/game/GameCanvas";
import GameSocket from "@/scene/game/GameSocket";

const GAME_PREPARING = 'gamePreparing'
export default {
  name: 'GameScene',
  computed: {
    ...mapState(['isLoading', 'isSystemPopup', 'bmsCurrent']),
  },
  props: {
    manager: null
  },
  created() {
    this.init()
  },
  data() {
    return {
      state: GAME_PREPARING,

    }
  },
  methods: {
    ...mapActions(
        ['showSystemPopup', 'showLoading', 'hideLoading', 'hideSceneChange']),
    async init() {
      this.user = await authenticationManager.userInfo()
      this.initGame()
      await this.manager.initScene(
          new GameCanvas(this),
          new GameSocket(this)
      )
      window.addEventListener('keydown', this.keyboard)
      await this.hideSceneChange()
    },
    keyboard(e) {
      if (this.isLoading || this.isSystemPopup || this.state === GAME_PREPARING) {
        return
      }

      if (e.key === 'ArrowUp') {
      } else if (e.key === 'ArrowDown') {
      } else if (e.key === 'ArrowLeft') {
      } else if (e.key === 'ArrowRight') {
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
      } else if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault()
      } else if (e.key === 'Escape') {
      }

    },
    initGame() {

    }
  }
}

</script>


<style scoped>

</style>