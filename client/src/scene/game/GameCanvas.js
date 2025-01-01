import {gsap} from "gsap";
import {AmbientLight, Matrix4} from "three";
import GameCanvasDrawer from "@/scene/game/GameCanvasRenderer";
import animateComboBasic from "@/animation/comboBasic";

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
    this.initSettings()
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
    this.drawUI()
    this.drawGear()
  }

  drawGear() {
    const key = this.vue.bms.bmsHeader.keys
    const gear = this.getGear()

    // render images and fonts
    /** gear.backboard */
    this.backboard = this.drawer.backboard(gear)
    this.ctx.scene.add(this.backboard)

    /** gear.bar-pool */
    this.barPool = []
    for (let i = 0; i < this.bars.length; i++) {
      this.barPool[i] = this.drawer.bar(gear)
      this.ctx.scene.add(this.barPool[i])
    }

    /** gear.block-pool */
    this.blockPool = []
    for (let i = 0; i < key + 1; i++) {
      this.blockPool[i] = []
    }
    for (let i = 0; i < this.bars.length; i++) {
      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j]
        const bmsChannel = block['bmsChannel'];
        let keyIndex = this.BLOCK_RENDER_MAP[bmsChannel]
        if (keyIndex === null || keyIndex === undefined) {
          continue
        }
        this.blockPool[keyIndex].push(this.drawer.blockPosition(gear, keyIndex))
        this.bars[i][j]['poolIndex'] = this.blockPool[keyIndex].length - 1
      }
    }
    this.instancedSprite = []
    for (let keyIndex = 0; keyIndex < key + 1; keyIndex++) {
      this.instancedSprite[keyIndex] = this.drawer.blockSprite(gear, keyIndex,
          this.blockPool[keyIndex])
      this.ctx.scene.add(this.instancedSprite[keyIndex])
    }

    /** gear.judgeEffect */
    this.judgeEffect = this.drawer.judgeEffect(gear)
    this.judgeEffect.setOpacity(0)
    this.ctx.scene.add(this.judgeEffect)

    /** gear.comboEffect */
    this.comboEffect = this.drawer.comboEffect(gear)
    this.comboEffect.setOpacity(0)
    this.ctx.scene.add(this.comboEffect)

    /** gear.hitEffect */
    this.hitEffects = []
    for (let i = 0; i <= key; i++) {
      this.hitEffects[i] = this.drawer.hitEffect(gear, i)
      this.hitEffects[i].setOpacity(0)
      this.ctx.scene.add(this.hitEffects[i])
    }

    /** gear.pressEffects */
    this.pressEffects = []
    for (let i = 1; i <= key; i++) {
      this.pressEffects[i] = this.drawer.pressEffect(gear, i)
      this.pressEffects[i].visible = false
      this.ctx.scene.add(this.pressEffects[i])
    }

    /** gear.scratchEffect */
    this.pressEffects[0] = this.drawer.scratchEffect(gear)
    this.pressEffects[0].visible = false
    this.ctx.scene.add(this.pressEffects[0])

    // render guideline
    if (this.uiSettings['showGuideline']) {
      /** gear.keyLines */
      this.keyLines = this.drawer.keyLines(gear, key)
      this.keyLines.forEach(line => {
        this.ctx.scene.add(line)
      })

      /** gear.scratch */
      this.scratchLine = this.drawer.scratchLine(gear)
      this.ctx.scene.add(this.scratchLine)

      /** gear.line */
      this.line = this.drawer.gearLine(gear)
      this.ctx.scene.add(this.line)

      /** gear.judgeLine */
      this.judgeLine = this.drawer.judgeLine(gear)
      this.ctx.scene.add(this.judgeLine)
    }
  }

  drawUI() {
    const key = this.vue.bms.bmsHeader.keys
    const keySettings = this.uiSettings['key_' + key]
    const ui = keySettings['ui']

    // render images and fonts
    /** time backboard */
    this.timeBackboard = this.drawer.timeBackboard(ui)
    this.ctx.scene.add(this.timeBackboard)

    /** bpm backboard */
    this.bpmBackboard = this.drawer.bpmBackboard(ui)
    this.ctx.scene.add(this.bpmBackboard)

    /** elapsedTime */
    this.elapsedTime = this.drawer.elapsedTime(ui, 'TIME: 00:00')
    this.ctx.scene.add(this.elapsedTime)

    /** bpm */
    this.bpm = this.drawer.bpm(ui, 'BPM: 0')
    this.ctx.scene.add(this.bpm)

    // render guideline
    if (this.uiSettings['showGuideline']) {
      /** ui.gameTime */
      this.timeBox = this.drawer.timeBox(ui)
      this.ctx.scene.add(this.timeBox)

      /** ui.bpmBox */
      this.bpmBox = this.drawer.bpmBox(ui)
      this.ctx.scene.add(this.bpmBox)
    }
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
    this.lastY = 0

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
    this.createKeyTargetQueues()
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

  createKeyTargetQueues() {
    this.keyTargetQueues = []
    for (let i = 0; i < this.bars.length; i++) {
      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j]
        const bmsChannel = block['bmsChannel']

        const keyIndex = this.BLOCK_RENDER_MAP[bmsChannel]
        if (keyIndex === null || keyIndex === undefined) {
          continue
        }

        if (!this.keyTargetQueues[keyIndex]) {
          this.keyTargetQueues[keyIndex] = []
        }

        this.keyTargetQueues[keyIndex].push(block)
      }
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

        if (block['time'] >= elapsedTime) {
          let time = lastTime
          if (isFirstShow) {
            time = elapsedTime
            isFirstShow = false
          }

          if (this.vue.stop <= block['time']) {
            block['y'] = lastY + (block['time'] - Math.max(time, this.vue.stop))
                * bpm * 0.005
                * this.vue.speed
            lastY = block['y']
            if (this.isOutofScreen(block)) {
              return
            }
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

      if (this.bars[i]['time'] >= elapsedTime) {
        let time = lastTime
        if (isFirstShow) {
          time = elapsedTime
          isFirstShow = false
        }

        this.bars[i]['y'] = lastY + (this.bars[i]['time'] - time) * bpm
            * 0.005
            * this.vue.speed
        lastY = this.bars[i]['y'];
        if (this.isOutofScreen(this.bars[i])) {
          return
        }
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
      this.processBlocks()
      this.updatePositions()
      this.updateBars()
      this.updateBlocks()
      this.updateText()
      this.updateEffect(now)
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
  }

  updateText() {
    // update elapsed time
    const elapsed = this.getFormatTime(
        Math.round(this.vue.elapsedTime * 0.001))
    this.elapsedTime.text = 'TIME : ' + elapsed

    // update bpm
    this.bpm.text = 'BPM: ' + this.formatBpm(this.vue.bpm)
  }

  // 반응성이 문제가 있다.
  updateEffect(now) {
    // update autoplay key effect
    const effectTime = 100
    if (this.autoPlay) {
      this.pressEffects.forEach(effect => {
        if (effect.visibleTime && effect.visibleTime + effectTime <= now) {
          effect.visible = false
          effect.visibleTime = null
        }
      })
    }
  }

  formatBpm(bpm) {
    if (Number.isInteger(bpm)) {
      const numberStr = bpm.toString()
      return numberStr.slice(0, 3)
    }
    return Math.floor(Math.random() * 900 + 100);
  }

  updateBars() {
    const bars = this.bars
    const elapsedTime = this.vue.elapsedTime
    const bmsHeight = this.getGear()['judgeLine']['y']

    for (let i = this.lastI; i < bars.length; i++) {
      const y = bars[i]['y'] * 0.01
      this.barPool[i].position.y = y + this.ctx.pixelToObj(bmsHeight)
      if (bars[i]['time'] <= elapsedTime) {
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
        const pos = this.blockPool[keyIndex][block['poolIndex']]
        const dummyMatrix = new Matrix4()
        this.instancedSprite[keyIndex].getMatrixAt(block['poolIndex'],
            dummyMatrix)
        dummyMatrix.setPosition(pos.x,
            y + this.ctx.pixelToObj(bmsHeight)
            , pos.z)

        if (block['played'] || block['time'] <= elapsedTime) {
          dummyMatrix.setPosition(pos.x, -30, pos.z)
        }

        this.instancedSprite[keyIndex].setMatrixAt(block['poolIndex'],
            dummyMatrix)
        this.instancedSprite[keyIndex].instanceMatrix.needsUpdate = true

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

        if (bmsChannel === 'BAR_SHORTEN') {
          continue;
        }

        if (block['time'] > elapsedTime) {
          return
        }

        if (bmsChannel === 'BPM') {
          this.vue.bpm = block['value'];
        } else if (bmsChannel === 'BPM_EXTENDED') {
          this.vue.bpm = this.vue.bms.bmsHeader.bpm[block['value']];
        } else if (bmsChannel === "SEQUENCE_STOP") {
          this.vue.stop = block['time'] + block['stop'];
        } else if (bmsChannel.startsWith('BACKGROUND')) {
          this.playBlock(block, true)
        } else if (bmsChannel.startsWith('PLAYER')) {
          // fimxe -> 이걸 동일한 '연주' 로직으로 묶어야 할수도 있다.
          this.processAutoPlay(block)
        } else if (bmsChannel === 'BGA') {
          this.vue.vga.play(block['value'])
        }

        if (this.isExpiredBlock(block)) {
          this.processBlockPlayed(block, false, false)
          this.lastI = i
          this.lastJ = j
        }
      }
    }
  }

  processAutoPlay(block) {
    if (!this.autoPlay) {
      return
    }
    if (!block['played']) {
      const bmsChannel = block['bmsChannel'];
      const keyIndex = this.BLOCK_RENDER_MAP[bmsChannel]
      this.pressEffects[keyIndex].visible = true
      this.pressEffects[keyIndex].visibleTime = performance.now()
    }

    this.processBlockPlayed(block, 'cool', true)
  }

  processBlockPlayed(block, judgement, sound, inputTime) {
    const judged = this.judge(block, judgement, inputTime)
    if (judged) {
      this.playBlock(block, sound)
      const keyIndex = this.BLOCK_RENDER_MAP[block['bmsChannel']]
      if (keyIndex === null || keyIndex === undefined) {
        return
      }
      if (this.keyTargetQueues[keyIndex].length > 1) {
        this.keyTargetQueues[keyIndex].shift()
      }

      this.doHitEffect(block, keyIndex)
      this.doComboEffect()
      this.doJudgeEffect(block)
    }
  }

  doHitEffect(block, keyIndex) {
    if (!block['judge']) {
      return
    }

    if (block['judge'] === 'cool'
        || block['judge'] === 'great'
        || block['judge'] === 'good'
    ) {

      animateComboBasic(this.hitEffects[keyIndex], 0.32, 0,
          this.hitEffects[keyIndex].scaleX, this.hitEffects[keyIndex].scaleY,
          4, 0.8)

      this.hitEffects[keyIndex].setCurrent(0, 1)
    }
  }

  doComboEffect() {
    animateComboBasic(this.comboEffect, 0.1, 0.6,
        this.comboEffect.widthPerDigit,
        this.comboEffect.heightPerDigit, 1.6, 0.8)

    this.comboEffect.setNumber(this.vue.judge.combo)
  }

  doJudgeEffect(block) {
    if (!block['judge']) {
      return
    }

    animateComboBasic(this.judgeEffect, 0.1, 0.3, this.judgeEffect.scaleX,
        this.judgeEffect.scaleY, 1.4, 0.8)

    // todo timediff 효과도 여기에?
    if (block['judge'] === 'cool') {
      this.judgeEffect.setCurrent(0, 3)
    } else if (block['judge'] === 'great') {
      this.judgeEffect.setCurrent(1, 3)
    } else if (block['judge'] === 'good') {
      this.judgeEffect.setCurrent(0, 2)
    } else if (block['judge'] === 'bad') {
      this.judgeEffect.setCurrent(1, 2)
    } else if (block['judge'] === 'miss') {
      this.judgeEffect.setCurrent(0, 1)
    }
  }

  /**
   * block['played'] = true 가 되는 상황은 아래와 같다.
   * -> block 의 유효시간은 block['time'] + this.judge['miss'] 이다.
   * 1. 블럭의 유효시간이 지났을때, block['time'] + this.judge['miss'] <= elapsedTime
   * 2. 블럭이 자동연주에 의해 연주되었을 때
   * 3. 유저가 키음을 통해 해당 블럭을 연주했을 때
   */
  playBlock(block, playSound) {
    if (block['played']) {
      return
    }
    if (playSound) {
      this.playSound(block)
    }
    block['played'] = true
  }

  playSound(block) {
    setImmediate(() => {
      try {
        this.vue.bmsSounds.get(block['value']).play();
      } catch (e) {
        console.error(e)
      }
    })
  }

  isExpiredBlock(block) {
    return block['time'] + this.judgement['bad'] < this.vue.elapsedTime;
  }

  isOutofScreen(block) {
    return block['y'] > 1000
  }

  judge(block, judgement, inputTime) {
    if (!block['bmsChannel'].startsWith('PLAYER') || block['judge']) {
      return false
    }
    if (judgement) {
      block['judge'] = judgement
      block['timeDiff'] = 0
      this.addCombo()
      return true
    }

    // 오차
    const timeDiff = Math.abs(block['time'] - parseInt(inputTime))
    block['timeDiff'] = timeDiff
    if (timeDiff <= this.judgement['cool']) {
      block['judge'] = 'cool'
      this.addCombo()
    } else if (timeDiff <= this.judgement['great']) {
      block['judge'] = 'great'
      this.addCombo()
    } else if (timeDiff <= this.judgement['good']) {
      block['judge'] = 'good'
      this.addCombo()
    } else if (timeDiff <= this.judgement['bad']) {
      block['judge'] = 'bad'
      this.removeCombo()
    } else if (block['time'] > inputTime) {
      if (block['time'] > inputTime + this.judgement['miss']) {
        // none
        return false
      } else {
        block['judge'] = 'miss'
        this.removeCombo()
      }
    } else {
      block['judge'] = 'miss'
      this.removeCombo()
    }
    return true
  }

  addCombo() {
    this.vue.combo++
    if (this.vue.combo > this.vue.maxCombo) {
      this.vue.maxCombo = this.vue.combo
    }
  }

  removeCombo() {
    this.vue.judge.combo = 0
  }

  handleKeys(e, isKeyDown = true) {
    const keyAction = this.keyMap[e.key]

    let inputTime = 0
    if (this.vue.startTime !== 0) {
      inputTime = e.timeStamp - this.vue.startTime - this.vue.pauseTime
    }

    if (keyAction) {
      keyAction(isKeyDown, inputTime)
    }
  }

  processKeyPlay(key, inputTime) {
    if (this.autoPlay) {
      return
    }
    const targetBlock = this.keyTargetQueues[key][0]

    // make sound
    this.playSound(targetBlock)

    // make score
    this.processBlockPlayed(targetBlock, false, false, inputTime)
  }

  keyPlay1(isKeyDown, inputTime) {
    if (this.autoPlay) {
      return
    }
    if (isKeyDown) {
      this.pressEffects[1].visible = true
      this.processKeyPlay(1, inputTime)
    } else {
      this.pressEffects[1].visible = false
    }
  }

  keyPlay2(isKeyDown, inputTime) {
    if (this.autoPlay) {
      return
    }
    if (isKeyDown) {
      this.pressEffects[2].visible = true
      this.processKeyPlay(2, inputTime)
    } else {
      this.pressEffects[2].visible = false
    }
  }

  keyPlay3(isKeyDown, inputTime) {
    if (this.autoPlay) {
      return
    }
    if (isKeyDown) {
      this.pressEffects[3].visible = true
      this.processKeyPlay(3, inputTime)
    } else {
      this.pressEffects[3].visible = false
    }
  }

  keyPlay4(isKeyDown, inputTime) {
    if (this.autoPlay) {
      return
    }
    if (isKeyDown) {
      this.pressEffects[4].visible = true
      this.processKeyPlay(4, inputTime)
    } else {
      this.pressEffects[4].visible = false
    }
  }

  keyPlay5(isKeyDown, inputTime) {
    if (this.autoPlay) {
      return
    }
    if (isKeyDown) {
      this.pressEffects[5].visible = true
      this.processKeyPlay(5, inputTime)
    } else {
      this.pressEffects[5].visible = false
    }
  }

  keyPlay6(isKeyDown, inputTime) {
    if (this.autoPlay) {
      return
    }
    if (isKeyDown) {
      this.pressEffects[6].visible = true
      this.processKeyPlay(6, inputTime)
    } else {
      this.pressEffects[6].visible = false
    }
  }

  keyPlay7(isKeyDown, inputTime) {
    if (this.autoPlay) {
      return
    }
    if (isKeyDown) {
      this.pressEffects[7].visible = true
      this.processKeyPlay(7, inputTime)
    } else {
      this.pressEffects[7].visible = false
    }
  }

  keyScratch(isKeyDown, inputTime) {
    if (this.autoPlay) {
      return
    }
    if (isKeyDown) {
      this.pressEffects[0].visible = true
      this.processKeyPlay(0, inputTime)
    } else {
      this.pressEffects[0].visible = false
    }
  }

  initSettings() {
    this.setDifficulty()
    this.setAutoPlay()
    this.setKeyMapping()
  }

  setDifficulty() {
    this.difficulty = this.vue.difficulty
    this.judgement = this.vue.playSettings['judge'][this.difficulty] // {cool : 25, great : 50, good : 100, bad : 200}
  }

  setAutoPlay() {
    this.autoPlay = this.vue.autoPlay
  }

  setKeyMapping() {
    this.keySettings = this.vue.keySettings["ingame"]
    this.keyMap = {}
    for (const command in this.keySettings) {
      let func
      let keys = this.keySettings[command]
      if (command === "play1") {
        func = this.keyPlay1
      } else if (command === "play2") {
        func = this.keyPlay2
      } else if (command === "play3") {
        func = this.keyPlay3
      } else if (command === "play4") {
        func = this.keyPlay4
      } else if (command === "play5") {
        func = this.keyPlay5
      } else if (command === "play6") {
        func = this.keyPlay6
      } else if (command === "play7") {
        func = this.keyPlay7
      } else if (command === "playScratch") {
        func = this.keyScratch
      } else if (command === "speed-up") {
        func = this.vue.speedUp
      } else if (command === "speed-down") {
        func = this.vue.speedDown
      } else if (command === "sound-up") {
        func = this.vue.soundUp
      } else if (command === "sound-down") {
        func = this.vue.soundDown
      } else if (command === "sound-toggle") {
        func = this.vue.soundToggle
      }

      for (const key of keys) {
        this.keyMap[key] = func.bind(this)
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