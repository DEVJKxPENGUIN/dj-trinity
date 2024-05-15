<template>
  <div class="flex">
    <transition name="slide-fade">
      <GameLoading
          v-if="showGameLoading"
          :bms-current="bmsCurrent"
          :load-state="loadState"
          @close="switchToGameBeforeStart"
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
import uiSettings from '../../options/ui/game.json'

const GAME_PREPARING = 'gamePreparing'
const GAME_BEFORE_START = 'gameBeforeStart'
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
      showGameLoading: false,

      bms: {},
      bmsSounds: new Map(),
      loadState: [],
      uiSettings: null,
    }
  },
  methods: {
    ...mapActions(
        ['showSystemPopup', 'showLoading', 'hideLoading', 'hideSceneChange']),
    async init() {
      this.user = await authenticationManager.userInfo()
      await this.manager.initScene(
          new GameCanvas(this),
          new GameSocket(this)
      )
      window.addEventListener('keydown', this.keyboard)
      await this.hideSceneChange()
      await this.initGame()
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
    async initGame() {
      this.showGameLoading = true
      await this.loadAll()
    },
    async loadAll() {
      if (!this.bmsCurrent.id) {
        throw new Error('no bmsId');
      }

      this.loadUISettings()
      await this.loadBms()
      this.loadSounds()
    },
    async loadBms() {
      this.loadState[1] = {
        title: 'bms',
        count: 0,
        size: 1,
      }

      this.bms = (await apiManager.get('/bms/' + this.bmsCurrent.id)).bms
      this.loadState[1].count++
    },
    loadSounds() {
      const header = this.bms.bmsHeader;

      // download bms sounds
      this.loadState[2] = {
        title: 'sounds',
        count: 0,
        size: 0,
      }

      header.wav.forEach((soundFile, i) => {
        if (!soundFile) {
          return;
        }

        this.loadState[2].size++
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
          this.loadState[2].count++
        })
        sound.once('loaderror', () => {
          this.loadState[2].count++
        })
      })
    },
    loadUISettings() {
      this.loadState[0] = {
        title: 'ui-settings',
        count: 0,
        size: 1,
      }

      // fixme -> change to get personal ui settings from server
      this.$nextTick(() => {
        this.uiSettings = uiSettings
        this.loadState[0].count++
      })
    },
    switchToGameBeforeStart() {
      this.showGameLoading = false
      this.manager.canvas.switchLoadingToGame()
      this.state = GAME_BEFORE_START
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