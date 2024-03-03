import {gsap} from "gsap";
import {
  AmbientLight,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  PointLight,
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
    const texture = new TextureLoader().load('assets/background6.webp')
    const geometry = new PlaneGeometry(16.272, 21.6)
    const material = new MeshLambertMaterial({
      map: texture,
      transparent: true
    })
    const background = new Mesh(geometry, material)
    background.position.set(-0.5, -1.0, -0.5)
    this.moveBackground(background)
    this.ctx.scene.add(background)
  }

  light() {
    const light0 = new AmbientLight(0xffffff, 0.005)
    this.ctx.scene.add(light0)

    const light = new PointLight(0xffffff, 1, 100)
    light.position.set(4, 3, 2)
    this.moveLight(light)
    this.ctx.scene.add(light)
  }

  moveLight(light) {
    gsap.to(light.position, {
      duration: 10,
      x: -4,
      y: -3,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }

  moveBackground(background) {
    gsap.to(background.position, {
      duration: 60,
      x: 0.5,
      y: -3.0,
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