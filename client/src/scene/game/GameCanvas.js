import {gsap} from "gsap";
import {AmbientLight} from "three";
import GameCanvasDrawer from "@/scene/game/GameCanvasRenderer";

export default class GameCanvas {

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
      this.barPool = this.drawer.barPool(gear)

      /** gear.block-pool */
      this.blockPool = this.drawer.blockPool(gear, key)
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

  update() {
    this.updateData()
    this.updateElapsedTime()
    this.updateBars()

  }

  updateData() {
    if (!this.vue.gameData) {
      return
    }

    // _변수명 : canvas.js 에서는 data 류 객체를 뜻한다.
    this._elapsedTime = this.vue.gameData.elapsedTime
    this._bars = this.vue.gameData.bars
  }

  updateElapsedTime() {
    if (!(this.vue.gameData && this.elapsedTime)) {
      return
    }

    const elapsed = this.getFormatTime(
        Math.round(this._elapsedTime * 0.001))
    this.drawer.updateText(this.elapsedTime, 'TIME: ' + elapsed)
  }

  updateBars() {
    // 1. 사용중인 bar 객체가 없다면 pool 에서 받아 씬에 등록하고 위치를 조정한다.
    // 2. 사용중인 bar 객체가 있다면 위치만 조정한다.
    // 3. 이미 판정선을 지났는데 barContainer에 있다면 bar 객체는 scene 에서 제거하고 pool 에 반납한다.
    if (!(this.vue.gameData && this.barPool)) {
      return
    }

    if (!this.barContainer) {
      this.barContainer = []
    }

    const bars = this._bars
    const elapsedTime = this._elapsedTime

    for (let i = 0; i < bars.length; i++) {
      const bmsHeight = this.getGear()['outline']['y']
      // const y = bmsHeight - bars[i].y
      const y = this.ctx.pixelToObj(bmsHeight + bars[i].y)

      // 아직 화면에 그릴 필요가 없음.
      if (y > 20) {
        break;
      }

      // 판정선을 지난 bar
      if (bars[i]['time'] < elapsedTime) {
        if (this.barContainer[i]) {
          console.log('finished : ', i + ' / ' + y + ' / ' + bars[i]['time'])
          this.ctx.scene.remove(this.barContainer[i])
          this.barPool.push(this.barContainer[i])
          this.barContainer[i] = null
        }
        continue
      }

      // 판정선을 지나지 않음. 컨테이너에 없다면 pool 에서 꺼내옴
      if (!this.barContainer[i]) {
        if (this.barPool.length === 0) {
          const newBar = this.drawer.bar(this.getGear())
          this.barPool.push(newBar)
        }
        console.log('get bar from pool : ', y + ' / ' + bars[i]['time'])
        this.barContainer[i] = this.barPool.pop()
        this.ctx.scene.add(this.barContainer[i])
      }
      this.barContainer[i].position.y = y
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