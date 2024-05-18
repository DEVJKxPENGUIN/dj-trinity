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

  switchLoadingToGame() {
    this.ctx.scene.remove(this.loadingBackground)

    // todo remove background, draw game UI
    this.drawGame()
  }

  drawGame() {
    const uiSettings = this.vue.uiSettings
    const key = this.vue.bms.bmsHeader.keys
    const keySettings = uiSettings['key_' + key]
    if (!keySettings) {
      this.vue.handleError(
          'Unable to load skin.',
          'your skin do not assist KEY [' + this.vue.bms.bmsHeader.keys
          + '], use another skin to play this.'
      )
      return
    }

    this.drawGear(uiSettings, key, keySettings)
    this.drawUI(uiSettings, key, keySettings)
  }

  drawGear(uiSettings, key, keySettings) {
    const gear = keySettings['gear']
    if (uiSettings['showGuideline']) {
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

      /** gear.blocks */
      // todo --> blocks 그려야 하는데, 어떻게? 다그려?

    }

    // render images and fonts

  }

  drawUI(uiSettings, key, keySettings) {

    const ui = keySettings['ui']
    if (uiSettings['showGuideline']) {
      /** ui.gameTime */
      this.timeBox = this.drawer.timeBox(ui)
      this.ctx.scene.add(this.timeBox)
    }

    // render images and fonts
    this.elapsedTime = this.drawer.elapsedTime(ui, 'TIME: 0')
    this.ctx.scene.add(this.elapsedTime)

  }

  light() {
    const light0 = new AmbientLight(0xffffff, 0.1)
    this.ctx.scene.add(light0)
  }

  update() {
    this.updateElapsedTime()

  }

  updateElapsedTime() {
    if (this.vue.gameData && this.elapsedTime) {
      const elapsed = this.getFormatTime(
          Math.round(this.vue.gameData.elapsedTime * 0.001))
      this.drawer.updateText(this.elapsedTime, 'TIME: ' + elapsed)
    }
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