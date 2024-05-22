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

    this.drawGear()
    this.drawUI()
  }

  drawGear() {
    const key = this.vue.bms.bmsHeader.keys
    const gear = this.getGear()
    if (this.uiSettings['showGuideline']) {
      /** gear.scratch */
      this.scratchLine = this.drawer.scratchLine(gear)
      this.ctx.scene.add(this.scratchLine)

      /** gear.keyLines */
      this.keyLines = this.drawer.keyLines(gear, key)
      this.keyLines.forEach(line => {
        this.ctx.scene.add(line)
      })

      /** gear.line */
      this.line = this.drawer.gearLine(gear)
      this.ctx.scene.add(this.line)

      /** gear.bar-pool */
      this.barPool = []
      for (let i = 0; i < this.bars.length; i++) {
        this.barPool[i] = this.drawer.bar(gear)
        this.ctx.scene.add(this.barPool[i])
      }

      /** gear.block-pool */
      this.blockPool = []
      for (let i = 0; i < this.vue.bms.bmsData.length; i++) {
        const block = this.vue.bms.bmsData[i]
        const bmsChannel = block['bmsChannel'];
        let keyIndex = this.BLOCK_RENDER_MAP[bmsChannel]
        if (keyIndex === null || keyIndex === undefined) {
          continue
        }
        this.blockPool[i] = this.drawer.block(gear, keyIndex)
        this.ctx.scene.add(this.blockPool[i])
      }
    }

    // render images and fonts

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

  initBms() {
    const header = this.vue.bms.bmsHeader;
    const data = this.vue.bms.bmsData;
    this.vue.startBpm = header.startBpm;
    this.vue.bpm = header.startBpm;

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
    const elapsedTime = this.vue.elapsedTime;

    let lastTime = this.vue.initialTime;
    let lastPos = 0;
    let lastY = 0;
    let bpm = this.vue.startBpm;
    let isFirstShow = true;
    for (let i = 0; i < this.bars.length; i++) {
      let barShorten = 1;

      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j];
        const bmsChannel = block['bmsChannel'];
        if (bmsChannel === 'BAR_SHORTEN') {
          barShorten = block['value'];
          continue;
        }
        block['time'] = lastTime + (block['position'] - lastPos) * (1 / bpm
            * 60000 * 4) * barShorten;
        if (block['time'] > elapsedTime) {
          let time;
          if (isFirstShow) {
            time = elapsedTime;
            isFirstShow = false;
          } else {
            time = lastTime;
          }

          if (this.vue.stop < block['time']) {
            block['y'] = lastY + (block['time'] - Math.max(time, this.vue.stop))
                * bpm * 0.005
                * this.vue.speed;
            lastY = block['y']
          }
        }

        lastTime = block['time'];
        lastPos = block['position'];

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

      this.bars[i]['time'] = lastTime + (1 - lastPos) * barShorten * (60000
          / bpm) * 4;
      if (this.bars[i]['time'] > elapsedTime) {
        let time;
        if (isFirstShow) {
          time = elapsedTime;
          isFirstShow = false;
        } else {
          time = lastTime;
        }

        this.bars[i]['y'] = lastY + (this.bars[i]['time'] - time) * bpm
            * 0.005
            * this.vue.speed;
        lastY = this.bars[i]['y'];
      }
      lastTime = this.bars[i]['time'];
      lastPos = 0;
    }
  }

  update() {
    const now = performance.now()
    this.updateElapsedTime(now)

    if (this.vue.state === GAME_PLAYING) {
      this.calculateBarTime()
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
    // 1. 사용중인 bar 객체가 없다면 pool 에서 받아 씬에 등록하고 위치를 조정한다.
    // 2. 사용중인 bar 객체가 있다면 위치만 조정한다.
    // 3. 이미 판정선을 지났는데 barContainer에 있다면 bar 객체는 scene 에서 제거하고 pool 에 반납한다.
    const bars = this.bars
    const elapsedTime = this.vue.elapsedTime
    const bmsHeight = this.getGear()['outline']['y']

    for (let i = 0; i < bars.length; i++) {
      const y = this.ctx.pixelToObj(bmsHeight + bars[i].y)
      this.barPool[i].position.y = y
      if (bars[i]['time'] < elapsedTime) {
        this.barPool[i].position.y = -30
      }
    }
  }

  updateBlocks() {
    const bars = this.bars
    const elapsedTime = this.vue.elapsedTime
    const gear = this.getGear()
    const bmsHeight = gear['outline']['y']

    let idx = 0
    for (let i = 0; i < bars.length; i++) {
      for (let j = 0; j < bars[i].length; j++) {
        const block = bars[i][j];
        const bmsChannel = block['bmsChannel'];

        let keyIndex = this.BLOCK_RENDER_MAP[bmsChannel]
        if (keyIndex === null || keyIndex === undefined) {
          idx++
          continue
        }

        const y = this.ctx.pixelToObj(bmsHeight + block.y)
        const blockHeight = this.ctx.pixelToObj(
            gear[keyIndex === 0 ? 'scratch' : 'key'
                + keyIndex]['block']['height'])

        this.blockPool[idx].position.y = y - blockHeight * 0.5
        if (block['time'] < elapsedTime) {
          this.blockPool[idx].position.y = -30
        }
        idx++
      }
    }
  }

  processBlocks() {
    const elapsedTime = this.vue.elapsedTime;

    for (let i = 0; i < this.bars.length; i++) {
      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j];

        if (block['played'] === true) {
          continue;
        }

        if (block['time'] > elapsedTime) {
          return;
        }

        const bmsChannel = block['bmsChannel'];
        if (bmsChannel === 'BPM') {
          this.vue.bpm = block['value'];
        } else if (bmsChannel === 'BPM_EXTENDED') {
          this.vue.bpm = this.vue.bms.bmsHeader.bpm[block['value']];
        } else if (bmsChannel === "SEQUENCE_STOP") {
          this.vue.stop = block['time'] + block['stop'];
        } else if (bmsChannel.startsWith('PLAYER') || bmsChannel.startsWith(
            'BACKGROUND')) {
          try {
            this.vue.bmsSounds.get(block['value']).play();
          } catch (e) {
            console.error(e)
          }
        }

        block['played'] = true;
      }
    }

  }

  getGear() {
    const key = this.vue.bms.bmsHeader.keys
    const keySettings = this.uiSettings['key_' + key]
    return keySettings['gear']
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