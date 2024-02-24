import {Color, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import settings from "../options/canvas/settings.json";
import IntroCanvas from "@/Scene/intro/IntroCanvas";

export default class AppManager {

  constructor() {
    this.init()
  }

  init() {
    this.scene = new Scene()
    console.log(settings.common.background.color)
    this.scene.background = new Color(settings.common.background.color)
    this.camera = new PerspectiveCamera(45,
        window.innerWidth / window.innerHeight, 0.1, 500)
    this.camera.position.z = 10

    this.renderer = new WebGLRenderer({})
    this.renderer.setPixelRatio(window.devicePixelRatio) // 고해상도 디스플레이 대응
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.insertBefore(this.renderer.domElement,
        document.body.firstChild)

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    this.draw = this.draw.bind(this)
    this.draw()
  }

  changeScene(scene) {
    this.removeScene()
    if (scene === 'intro') {
      this.currentScene = new IntroCanvas(this)
      this.currentScene.init()
      return
    }

  }

  removeScene() {
    if (!this.currentScene) {
      return
    }

    this.currentScene.destroy()
  }

  draw() {
    requestAnimationFrame(this.draw)
    this.renderer.render(this.scene, this.camera)
  }

}