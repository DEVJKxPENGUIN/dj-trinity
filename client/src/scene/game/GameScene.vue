<template>
  <div class="flex">
    <div class="absolute text-white anta-regular">FPS : {{ gameData ? gameData.fps : 0 }}</div>
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
import {Font, TTFLoader} from "three/addons";
import VideoManager from "@/manager/videoManager";

const GAME_PREPARING = 'gamePreparing'
const GAME_READY = 'gameReady'
const GAME_PLAYING = 'gamePlaying'
const GAME_PAUSED = 'gamePaused'
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
      // scene
      state: GAME_PREPARING,
      showGameLoading: false,

      // resources
      bms: {},
      bmsSounds: new Map(),
      fonts: new Map(),
      loadState: [],
      uiSettings: null,
      vga: null,

      // in-game
      startTime: null,
      pauseTime: 0,
      elapsedTime: 0,
      lastFrameTime: null,
      initialTime: 2000,
      speed: 0.8,
      stop: 0,
      startBpm: 0,
      bpm: 0
    }
  },
  methods: {
    ...mapActions(
        ['showSystemPopup', 'showLoading', 'hideLoading', 'hideSceneChange']),
    async init() {
      this.user = await authenticationManager.userInfo()
      await this.manager.initScene(
          new GameCanvas(this),
          new GameSocket(this),
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
        this.handleEnter()
        e.preventDefault()
      } else if (e.key === 'Escape') {
        this.handleEsc()
      }

    },
    handleEsc() {
      if (this.state === GAME_PREPARING) {
        this.$emit('changeScene', 'lobbyScene')
        return
      }
    },
    handleEnter() {
      if (this.state === GAME_READY) {
        this.startGame()
        return
      }

      if (this.state === GAME_PLAYING) {
        this.pauseGame()
        return
      }

      if (this.state === GAME_PAUSED) {
        this.resumeGame()
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

      await this.loadUISettings()
      await this.loadBms()
      this.loadSounds()
      this.loadFonts()
      this.loadVga()
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
              preload: true
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
    async loadUISettings() {
      return new Promise(resolve => {
        this.loadState[0] = {
          title: 'ui-settings',
          count: 0,
          size: 1,
        }

        // fixme -> change to get personal ui settings from server
        this.$nextTick(() => {
          this.uiSettings = uiSettings
          this.loadState[0].count++
          resolve()
        })
      })
    },
    loadFonts() {
      this.loadState[3] = {
        title: 'fonts',
        count: 0,
        size: 0,
      }

      const loader = new TTFLoader()
      this.uiSettings['downloads']['fonts'].forEach(fontInfo => {
        const fontName = fontInfo['name']
        const fontPath = fontInfo['path']

        this.loadState[3].size++
        loader.load(fontPath, json => {
          this.fonts.set(fontName, new Font(json))
          this.loadState[3].count++
        })
      })
    },
    async loadVga() {
      const header = this.bms.bmsHeader;

      // download bms vga
      this.loadState[4] = {
        title: 'vga',
        count: 0,
        size: 0,
      }

      for (const bmpFile of header.bmp) {
        if (!bmpFile) {
          continue;
        }
        this.loadState[4].size++
      }

      const videoManager = new VideoManager()
      for (const bmpFile of header.bmp) {
        const i = header.bmp.indexOf(bmpFile);
        if (!bmpFile) {
          continue;
        }

        await videoManager.load(i, '/download/bms/bmp/' + this.bmsCurrent.id + '/' + bmpFile)
        this.loadState[4].count++
      }
      this.vga = videoManager
    },
    switchToGameBeforeStart() {
      this.showGameLoading = false
      this.manager.canvas.switchLoadingToGame()

      this.state = GAME_READY
    },
    startGame() {
      this.state = GAME_PLAYING
      this.startTime = performance.now()
    },
    pauseGame() {
      this.state = GAME_PAUSED
    },
    resumeGame() {
      this.state = GAME_PLAYING
    },
    handleError(title, contents) {
      this.$store.dispatch('showSystemPopup', {
        title: title,
        contents: contents,
        button: 'OK',
        callback: () => {
          this.$emit('changeScene', 'lobbyScene')
        }
      })
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.keyboard)
      this.bmsSounds.forEach(sound => {
        if (!sound) {
          return
        }
        sound.unload()
      })
      this.vga.destroy()
    }
  }
}

</script>


<style scoped>

</style>