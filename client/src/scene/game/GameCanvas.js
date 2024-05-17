import {gsap} from "gsap";
import {AmbientLight} from "three";
import GameCanvasDrawer from "@/scene/game/GameCanvasRenderer";

export default class GameCanvas {

  constructor(vue) {
    this.vue = vue
    this.manager = vue.manager
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
    this.drawGear()
  }

  drawGear() {
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

    const gear = keySettings['gear']
    if (uiSettings.showGuideline) {
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

    // todo render images

  }

  light() {
    const light0 = new AmbientLight(0xffffff, 0.1)
    this.ctx.scene.add(light0)
  }

  destroy() {
    gsap.globalTimeline.clear()
  }
}