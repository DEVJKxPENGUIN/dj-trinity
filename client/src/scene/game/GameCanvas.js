import {gsap} from "gsap";

export default class GameCanvas {

  constructor(vue) {
    this.vue = vue
  }

  async init(ctx) {
    this.ctx = ctx

    this.background()
    this.light()
  }

  background() {


  }

  light() {


  }

  destroy() {
    gsap.globalTimeline.clear()
  }
}