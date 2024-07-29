import {gsap} from "gsap";
import {AmbientLight} from "three";
import GameCanvasDrawer from "@/scene/game/GameCanvasRenderer";

const GAME_PREPARING = 'gamePreparing'
const GAME_READY = 'gameReady'
const GAME_PLAYING = 'gamePlaying'
const GAME_PAUSED = 'gamePaused'

export default class GameCanvas {

  BLOCK_RENDER_MAP = {
    PLAYER1_1: 1,
    PLAYER1_2: 2,
    PLAYER1_3: 3,
    PLAYER1_4: 4,
    PLAYER1_5: 5,
    PLAYER1_6: 0,
    PLAYER1_8: 6,
    PLAYER1_9: 7
  }

  constructor(vue) {
    this.vue = vue
  }

  async init(ctx) {
    this.ctx = ctx
    this.drawer = new GameCanvasDrawer(this)

    this.loadBackground()
    this.light()
  }

  loadBackground() {
    // background for loading
    this.loadingBackground = this.drawer.loadingBackgroundMesh()
    this.ctx.scene.add(this.loadingBackground)
  }

  light() {
    const light0 = new AmbientLight(0xffffff, 0.1)
    this.ctx.scene.add(light0)
  }

  switchLoadingToGame() {
    this.ctx.scene.remove(this.loadingBackground)

    // todo remove background, draw game UI
    this.initBms()
    this.drawGame()
  }

  drawGame() {
    this.uiSettings = this.vue.uiSettings
    const key = this.vue.bms.bmsHeader.keys
    const keySettings = this.uiSettings['key_' + key]
    if (!keySettings) {
      this.vue.handleError(
          'Unable to load skin.',
          'your skin do not assist KEY [' + this.vue.bms.bmsHeader.keys
          + '], use another skin to play this.'
      )
      return
    }

    this.drawVga()
    this.drawGear()
    this.drawUI()
  }

  drawGear() {
    const key = this.vue.bms.bmsHeader.keys
    const gear = this.getGear()

    // render images and fonts
    /** gear.backboard */
    this.backboard = this.drawer.backboard(gear)
    this.ctx.scene.add(this.backboard)

    /** gear.keyLines */
    this.keyLines = this.drawer.keyLines(gear, key)
    this.keyLines.forEach(line => {
      this.ctx.scene.add(line)
    })

    /** gear.bar-pool */
    this.barPool = []
    for (let i = 0; i < this.bars.length; i++) {
      this.barPool[i] = this.drawer.bar(gear)
      this.ctx.scene.add(this.barPool[i])
    }

    // render guideline
    if (this.uiSettings['showGuideline']) {
      /** gear.scratch */
      this.scratchLine = this.drawer.scratchLine(gear)
      this.ctx.scene.add(this.scratchLine)

      /** gear.line */
      this.line = this.drawer.gearLine(gear)
      this.ctx.scene.add(this.line)

      /** gear.judgeLine */
      this.judgeLine = this.drawer.judgeLine(gear)
      this.ctx.scene.add(this.judgeLine)

      /** gear.block-pool */
      this.blockPool = []
      for (let i = 0; i < this.bars.length; i++) {
        this.blockPool[i] = []
        for (let j = 0; j < this.bars[i].length; j++) {
          const block = this.bars[i][j]
          const bmsChannel = block['bmsChannel'];
          let keyIndex = this.BLOCK_RENDER_MAP[bmsChannel]
          if (keyIndex === null || keyIndex === undefined) {
            continue
          }
          this.blockPool[i][j] = this.drawer.block(gear, keyIndex)
          this.ctx.scene.add(this.blockPool[i][j])
        }
      }
    }
  }

  drawUI() {
    const key = this.vue.bms.bmsHeader.keys
    const keySettings = this.uiSettings['key_' + key]
    const ui = keySettings['ui']
    if (this.uiSettings['showGuideline']) {
      /** ui.gameTime */
      this.timeBox = this.drawer.timeBox(ui)
      this.ctx.scene.add(this.timeBox)
    }

    // render images and fonts
    this.elapsedTime = this.drawer.elapsedTime(ui, 'TIME: 0')
    this.ctx.scene.add(this.elapsedTime)
  }

  drawVga() {
    for (const [k, video] of this.vue.vga.videoMap) {
      this.vgaBackground = this.drawer.vgaBackgroundMesh(video)
      this.ctx.scene.add(this.vgaBackground)
    }
  }

  initBms() {
    const header = this.vue.bms.bmsHeader;
    const data = this.vue.bms.bmsData;
    this.vue.startBpm = header.startBpm;
    this.vue.bpm = header.startBpm;
    this.lastI = 0
    this.lastJ = 0

    this.bars = data.reduce((acc, cur) => {
      if (acc[cur.bar]) {
        acc[cur.bar].push(cur);
        return acc;
      }
      acc[cur.bar] = [cur];
      return acc;
    }, []);

    for (let i = 0; i < this.bars.length; i++) {
      if (!this.bars[i]) {
        this.bars[i] = []
      }
    }

    this.calculateBarTime()
  }

  calculateBarTime() {
    let lastTime = this.vue.initialTime
    let lastPos = 0
    let bpm = this.vue.startBpm

    for (let i = 0; i < this.bars.length; i++) {
      let barShorten = 1
      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j]
        const bmsChannel = block['bmsChannel']
        if (bmsChannel === 'BAR_SHORTEN') {
          barShorten = block['value']
          continue
        }

        block['time'] = lastTime + (block['position'] - lastPos)
            * (1 / bpm * 60000 * 4) * barShorten

        lastTime = block['time']
        lastPos = block['position']

        if (bmsChannel === 'BPM') {
          bpm = block['value']
        } else if (bmsChannel === 'BPM_EXTENDED') {
          bpm = this.vue.bms.bmsHeader.bpm[block['value']]
        } else if (bmsChannel === 'SEQUENCE_STOP') {
          if (this.vue.bms.bmsHeader.stop[block['value']]) {
            block['stop'] = this.vue.bms.bmsHeader.stop[block['value']] / 192
                / bpm * 60000 * 4
            lastTime += block['stop']
          }
        }
      }

      this.bars[i]['time'] = lastTime + (1 - lastPos) * barShorten * (60000
          / bpm) * 4
      lastTime = this.bars[i]['time']
      lastPos = 0
    }

  }

  updatePositions() {
    const elapsedTime = this.vue.elapsedTime
    let lastTime = this.vue.initialTime
    let lastY = 0
    let bpm = this.vue.bpm
    let isFirstShow = true;
    for (let i = this.lastI; i < this.bars.length; i++) {
      for (let j = i === this.lastI ? this.lastJ : 0; j < this.bars[i].length;
          j++) {

        const block = this.bars[i][j]
        const bmsChannel = block['bmsChannel'];
        if (bmsChannel === 'BAR_SHORTEN') {
          continue;
        }

        if (block['time'] > elapsedTime) {
          let time = lastTime
          if (isFirstShow) {
            time = elapsedTime
            isFirstShow = false
          }

          if (this.vue.stop < block['time']) {
            const y = lastY + (block['time'] - Math.max(time, this.vue.stop))
                * bpm * 0.005
                * this.vue.speed;
            if (y > 1000) {
              return
            }
            block['y'] = y
            lastY = block['y']
          }
        }

        lastTime = block['time']

        if (bmsChannel === 'BPM') {
          bpm = block['value'];
        } else if (bmsChannel === 'BPM_EXTENDED') {
          bpm = this.vue.bms.bmsHeader.bpm[block['value']];
        } else if (bmsChannel === 'SEQUENCE_STOP') {
          if (this.vue.bms.bmsHeader.stop[block['value']]) {
            const stopTime = this.vue.bms.bmsHeader.stop[block['value']] / 192
                / bpm * 60000 * 4;
            block['stop'] = stopTime;
            lastTime += stopTime;
          }
        }
      }

      if (this.bars[i]['time'] > elapsedTime) {
        let time = lastTime
        if (isFirstShow) {
          time = elapsedTime
          isFirstShow = false
        }

        const y = lastY + (this.bars[i]['time'] - time) * bpm
            * 0.005
            * this.vue.speed;
        if (y > 1000) {
          return
        }
        this.bars[i]['y'] = y
        lastY = this.bars[i]['y'];
      }
      lastTime = this.bars[i]['time']
    }
  }

  update() {
    const now = performance.now()
    this.updateElapsedTime(now)
    if (this.vue.state === GAME_PAUSED) {
      this.vue.vga.pause()
    } else if (this.vue.state === GAME_PLAYING) {
      this.vue.vga.resume()
      this.updatePositions()
      this.updateBars()
      this.updateBlocks()
      this.processBlocks()
    }
  }

  updateElapsedTime(now) {
    if (!this.vue.startTime) {
      this.vue.startTime = 0
    }
    if (this.vue.state === GAME_READY || this.vue.state === GAME_PREPARING) {
      return
    }
    if (this.vue.state === GAME_PAUSED) {
      this.vue.pauseTime = now - this.vue.elapsedTime - this.vue.startTime
    }
    this.vue.elapsedTime = now - this.vue.startTime - this.vue.pauseTime

    const elapsed = this.getFormatTime(
        Math.round(this.vue.elapsedTime * 0.001))
    this.drawer.updateText(this.elapsedTime, 'TIME: ' + elapsed)
  }

  updateBars() {
    const bars = this.bars
    const elapsedTime = this.vue.elapsedTime
    const bmsHeight = this.getGear()['judgeLine']['y']

    for (let i = this.lastI; i < bars.length; i++) {
      const y = bars[i]['y'] * 0.01
      this.barPool[i].position.y = y + this.ctx.pixelToObj(bmsHeight)
      if (bars[i]['time'] < elapsedTime) {
        this.barPool[i].position.y = -30
      }

      if (this.bars[i]['y'] === undefined) {
        return
      }
    }
  }

  updateBlocks() {
    const bars = this.bars
    const elapsedTime = this.vue.elapsedTime
    const gear = this.getGear()
    const bmsHeight = gear['judgeLine']['y']

    for (let i = this.lastI; i < bars.length; i++) {
      for (let j = i === this.lastI ? this.lastJ : 0; j < bars[i].length; j++) {
        const block = bars[i][j];
        const bmsChannel = block['bmsChannel'];

        let keyIndex = this.BLOCK_RENDER_MAP[bmsChannel]
        if (keyIndex === null || keyIndex === undefined) {
          continue
        }

        const y = block.y * 0.01
        const blockHeight = this.ctx.pixelToObj(
            gear[keyIndex === 0 ? 'scratch' : 'key'
                + keyIndex]['block']['height'])

        this.blockPool[i][j].position.y = y - blockHeight * 0.5
            + this.ctx.pixelToObj(bmsHeight)
        if (block['time'] < elapsedTime) {
          this.blockPool[i][j].position.y = -30
        }

        if (block['y'] === undefined) {
          return
        }
      }
    }
  }

  processBlocks() {
    const elapsedTime = this.vue.elapsedTime;

    for (let i = this.lastI; i < this.bars.length; i++) {
      for (let j = i === this.lastI ? this.lastJ : 0; j < this.bars[i].length;
          j++) {
        const block = this.bars[i][j];
        const bmsChannel = block['bmsChannel']
        if (block['played'] === true) {
          continue;
        }

        if (bmsChannel === 'BAR_SHORTEN') {
          continue;
        }

        if (block['time'] > elapsedTime) {
          return;
        }

        if (bmsChannel === 'BPM') {
          this.vue.bpm = block['value'];
        } else if (bmsChannel === 'BPM_EXTENDED') {
          this.vue.bpm = this.vue.bms.bmsHeader.bpm[block['value']];
        } else if (bmsChannel === "SEQUENCE_STOP") {
          this.vue.stop = block['time'] + block['stop'];
        } else if (bmsChannel.startsWith('PLAYER') || bmsChannel.startsWith(
            'BACKGROUND')) {
          setImmediate(() => {
            try {
              this.vue.bmsSounds.get(block['value']).play();
            } catch (e) {
              console.error(e)
            }
          })
        } else if (bmsChannel === 'BGA') {
          this.vue.vga.play(block['value'])
        }

        block['played'] = true;
        this.lastI = i
        this.lastJ = j
      }
    }

  }

  getGear() {
    if (this.gear === undefined) {
      const key = this.vue.bms.bmsHeader.keys
      const keySettings = this.uiSettings['key_' + key]
      return this.gear = keySettings['gear']
    }
    return this.gear
  }

  getFormatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  destroy() {
    gsap.globalTimeline.clear()
  }
}