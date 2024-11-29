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
import {Howl, Howler} from 'howler';
import GameLoading from "@/scene/game/GameLoading.vue";
import uiSettings from '../../options/ui/game.json'
import keySettings from '../../options/ui/keyset.json'
import playSettings from '../../options/ingame/play.json'
import VideoManager from "@/manager/videoManager";
import {preloadFont} from "troika-three-text";
import {TextureLoader} from "three";

const GAME_PREPARING = 'gamePreparing'
const GAME_READY = 'gameReady'
const GAME_PLAYING = 'gamePlaying'
const GAME_PAUSED = 'gamePaused'
export default {
  name: 'GameScene',
  components: {GameLoading},
  computed: {
    ...mapState(['isLoading', 'isSystemPopup', 'bmsCurrent', 'difficulty', 'autoPlay']),
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
      textures: new Map(),
      loadState: [],
      uiSettings: null,
      keySettings: null,
      playSettings: null,
      vga: null,

      // in-game
      startTime: null,
      pauseTime: 0,
      elapsedTime: 0,
      lastFrameTime: null,
      initialTime: 2000,
      speed: 1.0,
      stop: 0,
      startBpm: 0,
      bpm: 0,
      volume: 1.0,
      mute: false
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
      window.addEventListener('keyup', this.keyboard)
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
      } else if (e.key === 'Enter' && !e.isComposing) {
        if (e.type === 'keydown') {
          this.handleEnter()
          e.preventDefault()
        }
      } else if (e.key === 'Escape') {
        if (e.type === 'keydown') {
          this.handleEsc()
          e.preventDefault()
        }
      } else {
        this.handleExtra(e)
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
    handleExtra(e) {
      if (this.state === GAME_PREPARING) {
        return
      }
      if (e.type === 'keydown') {
        this.manager.canvas.handleKeys(e.key, true)
        return
      }
      if (e.type === 'keyup') {
        this.manager.canvas.handleKeys(e.key, false)
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

      await this.loadSettings()
      await this.loadBms()
      this.loadSounds()
      this.loadFonts()
      this.loadTextures()
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

      Howler.volume(this.volume)
      this.bmsSounds.forEach(sound => {
        sound.once('load', () => {
          this.loadState[2].count++
        })
        sound.once('loaderror', () => {
          this.loadState[2].count++
        })
      })
    },
    async loadSettings() {
      return new Promise(resolve => {
        this.loadState[0] = {
          title: 'ui-settings',
          count: 0,
          size: 1,
        }

        // fixme -> change to get personal ui/key settings from server
        this.$nextTick(() => {
          this.uiSettings = uiSettings
          this.keySettings = keySettings
          this.playSettings = playSettings
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

      this.uiSettings['downloads']['fonts'].forEach(fontInfo => {
        const fontName = fontInfo['name']
        const fontPath = fontInfo['path']

        this.loadState[3].size++
        preloadFont({
          font: fontPath
        }, () => {
          this.fonts.set(fontName, fontPath)
          this.loadState[3].count++
        })
      })
    },
    async loadTextures() {
      this.loadState[4] = {
        title: 'assets',
        count: 0,
        size: 0,
      }

      this.uiSettings['downloads']['textures'].forEach(textureInfo => {
        const textureName = textureInfo['name']
        const texturePath = textureInfo['path']

        this.loadState[4].size++
        new TextureLoader().load(texturePath, texture => {
          this.textures.set(textureName, texture)
          this.loadState[4].count++
        })
      })
    },
    async loadVga() {
      const header = this.bms.bmsHeader;

      // download bms vga
      this.loadState[5] = {
        title: 'vga',
        count: 0,
        size: 0,
      }

      for (const bmpFile of header.bmp) {
        if (!bmpFile) {
          continue;
        }
        this.loadState[5].size++
      }

      const videoManager = new VideoManager()
      for (const bmpFile of header.bmp) {
        const i = header.bmp.indexOf(bmpFile);
        if (!bmpFile) {
          continue;
        }

        await videoManager.load(i, '/download/bms/bmp/' + this.bmsCurrent.id + '/' + bmpFile)
        this.loadState[5].count++
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
    speedUp(isKeyDown) {
      if (!isKeyDown) {
        return
      }
      if (this.speed > 1.8) {
        return
      }
      this.speed += 0.1
    },
    speedDown(isKeyDown) {
      if (!isKeyDown) {
        return
      }
      if (this.speed < 0.2) {
        return
      }
      this.speed -= 0.1
    },
    soundUp(isKeyDown) {
      if (!isKeyDown) {
        return
      }
      if (this.volume > 1.0) {
        return
      }
      this.volume += 0.05
      Howler.volume(this.volume)
    },
    soundDown(isKeyDown) {
      if (!isKeyDown) {
        return
      }
      if (this.volume < 0.0) {
        return
      }
      this.volume -= 0.05
      Howler.volume(this.volume)
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