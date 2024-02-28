import {gsap} from "gsap";

export default class LobbyCanvas {

  constructor(vue) {
    this.vue = vue
  }

  async init(ctx) {
    this.ctx = ctx

    this.background()
    this.light()
  }

  background() {
    // todo
  }

  light() {
    // todo
  }

  destroy() {
    gsap.globalTimeline.clear()
  }
}