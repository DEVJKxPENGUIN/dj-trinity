import {gsap} from "gsap";
import {
  AmbientLight,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  TextureLoader
} from "three";

export default class GameCanvas {

  constructor(vue) {
    this.vue = vue
  }

  async init(ctx) {
    this.ctx = ctx

    this.loadBackground()
    this.light()
  }

  loadBackground() {
    const texture = new TextureLoader().load(
        process.env.VUE_APP_API_HOST + '/download/bms/stage/'
        + this.vue.bmsCurrent.id)

    const geometry = new PlaneGeometry(14, 14)
    const material = new MeshLambertMaterial({
      map: texture,
      transparent: true
    })
    this.loadingBackground = new Mesh(geometry, material)
    this.loadingBackground.position.set(0, 0, 0)
    this.ctx.scene.add(this.loadingBackground)
  }

  switchLoadingToGame() {
    this.ctx.scene.remove(this.loadingBackground)

    // todo remove background, draw game UI
    this.drawBmsGear()
  }

  drawBmsGear() {
    const uiSettings = this.vue.uiSettings

    alert('uiSettings : ' + uiSettings)

  }

  light() {
    const light0 = new AmbientLight(0xffffff, 0.1)
    this.ctx.scene.add(light0)
  }

  destroy() {
    gsap.globalTimeline.clear()
  }
}