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

    this.background()
    this.light()
  }

  background() {
    const texture = new TextureLoader().load(
        process.env.VUE_APP_API_HOST + '/download/bms/stage/'
        + this.vue.bmsCurrent.id)

    const geometry = new PlaneGeometry(14, 14)
    const material = new MeshLambertMaterial({
      map: texture,
      transparent: true
    })
    const background = new Mesh(geometry, material)
    background.position.set(0, 0, 0)
    // this.moveBackground(background)
    this.ctx.scene.add(background)
  }

  light() {
    const light0 = new AmbientLight(0xffffff, 0.1)
    this.ctx.scene.add(light0)
  }

  moveBackground(background) {
    gsap.to(background.position, {
      duration: 60,
      x: 0.5,
      y: -2.0,
      z: 0.5,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true,
    })
  }

  destroy() {
    gsap.globalTimeline.clear()
  }
}