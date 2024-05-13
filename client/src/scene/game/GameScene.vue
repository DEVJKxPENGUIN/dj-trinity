<template>
  <div>

    <transition name="slide-fade">
      <GameLoading
          v-if="showGameLoading"
          :bms-current="bmsCurrent"
          :load-state="loadState"
          @close="onFinishGameLoading"
      />
    </transition>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import * as authenticationManager from "@/manager/authenticationManager";
import * as apiManager from "@/manager/apiManager";
import GameCanvas from "@/scene/game/GameCanvas";
import GameSocket from "@/scene/game/GameSocket";
import {Howl} from 'howler';
import GameLoading from "@/scene/game/GameLoading.vue";

const GAME_PREPARING = 'gamePreparing'
export default {
  name: 'GameScene',
  components: {GameLoading},
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
      showGameLoading: true,

      bms: {},
      bmsSounds: new Map(),
      loadState: []
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
      if (this.isLoading || this.isSystemPopup) {
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
        this.handleEsc()
      }

    },
    handleEsc() {
      if (this.state === GAME_PREPARING) {
        console.log('handleEsc')
        this.$emit('changeScene', 'lobbyScene')
        return
      }
    },
    initGame() {
      this.loadBmsResources()

    },
    async loadBmsResources() {
      if (!this.bmsCurrent.id) {
        throw new Error('no bmsId');
      }

      this.bms = (await apiManager.get('/bms/' + this.bmsCurrent.id)).bms

      await this.loadSounds()
    },
    async loadSounds() {
      const header = this.bms.bmsHeader;

      // download bms sounds
      this.loadState[0] = {
        title: 'sounds',
        count: 0,
        size: 0,
      }

      header.wav.forEach((soundFile, i) => {
        if (!soundFile) {
          return;
        }

        this.loadState[0].size++
        this.bmsSounds.set(
            i,
            new Howl({
              src: [
                "http://localhost:5002/download/bms/sound/" +
                this.bmsCurrent.id +
                "/" +
                soundFile,
              ],
            })
        );
      });

      this.bmsSounds.forEach(sound => {
        sound.once('load', () => {
          this.loadState[0].count++
        })
        sound.once('loaderror', () => {
          this.loadState[0].count++
        })
      })
    },
    onFinishGameLoading() {
      // todo
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.keyboard)
      this.bmsSounds.forEach(sound => {
        if (!sound) {
          return
        }
        sound.unload()
      })
    }
  }
}

</script>


<style scoped>

</style>