import {
  AmbientLight,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  PointLight,
  TextureLoader
} from "three";
import {gsap} from 'gsap'

export default class IntroCanvas {

  constructor(vue) {
    this.vue = vue
  }

  async init(ctx) {
    this.ctx = ctx
    this.background()
    this.light()
  }

  background() {
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load('assets/background.webp')
    const geometry = new PlaneGeometry(14.6, 10)
    const material = new MeshLambertMaterial({
      map: texture,
      transparent: true,
    })
    const background = new Mesh(geometry, material)
    background.position.x = -2
    this.moveBackground(background)
    this.ctx.scene.add(background)
  }

  light() {
    const light0 = new AmbientLight(0xffffff, 0.002)
    this.ctx.scene.add(light0)

    // const light = new SpotLight(0xffffff, 0.5, 100, 180, 0.5)
    const light = new PointLight(0xffffff, 0.5, 100)
    light.position.set(4, 3, 3)
    this.moveLight(light)
    this.ctx.scene.add(light)
  }

  moveBackground(background) {
    gsap.to(background.position, {
      duration: 30,
      x: -4,
      z: 2,
      repeat: -1,
      yoyo: true,
    })
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

  destroy() {
    gsap.globalTimeline.clear()
  }
}