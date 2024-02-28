import {gsap} from "gsap";
import {
  AmbientLight,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  SpotLight,
  TextureLoader
} from "three";

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
    const texture = new TextureLoader().load('assets/background3.webp')
    const geometry = new PlaneGeometry(15.6574, 8.8088)
    const material = new MeshLambertMaterial({
      map: texture,
      transparent: true
    })
    const background = new Mesh(geometry, material)
    this.ctx.scene.add(background)
  }

  light() {
    const light0 = new AmbientLight(0xffffff, 0.01)
    this.ctx.scene.add(light0)

    const light = new SpotLight(0xffffff, 1, 100, 0, 0.5, 2)
    light.position.set(0, 1, 2)
    this.moveLight(light)
    this.ctx.scene.add(light)
  }

  moveLight(light) {
    gsap.to(light, {
      duration: 10,
      angle: 360,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true,
    })


    // gsap.to(light.position, {
    //   duration: 10,
    //   x: 0,
    //   y: 0,
    //   repeat: -1,
    //   repeatDelay: 0,
    //   yoyo: true,
    //   ease: 'power1.inOut'
    // })
  }

  destroy() {
    gsap.globalTimeline.clear()
  }
}