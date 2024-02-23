import {Color, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import settings from "../options/canvas/settings.json";

export default class AppManager {

  constructor() {
    this.init()
  }

  init() {
    this.scene = new Scene()
    console.log(settings.common.background.color)
    this.scene.background = new Color(settings.common.background.color)
    this.camera = new PerspectiveCamera(75,
        window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.insertBefore(this.renderer.domElement,
        document.body.firstChild)

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    this.draw()
  }

  draw() {
    requestAnimationFrame(this.draw)
    this.renderer.render(this.scene, this.camera)
  }

}