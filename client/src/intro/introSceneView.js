import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Vector3
} from "three";
import {CSS3DObject, TextGeometry} from "three/addons";
import {Tween} from "@tweenjs/tween.js";

export default class IntroSceneView {

  constructor(manager) {
    this.manager = manager
  }

  init = () => {
    // title
    const mainTitleG = new TextGeometry('TRINITY', {
      font: this.manager.resources.fonts["Orbitron_Regular.json"],
      size: 150,
    })
    mainTitleG.computeBoundingBox()
    this.mainTitle = new Mesh(mainTitleG, new MeshBasicMaterial({
      color: 0xffffff
    }))
    this.mainTitle.position.x = -0.5 * (mainTitleG.boundingBox.max.x
        - mainTitleG.boundingBox.min.x)
    this.mainTitle.position.y = 100
    this.mainTitle.scale.set(1, 1.3, 1)

    // subtitle
    const subTitleG = new TextGeometry('DJ TECHNICION', {
      font: this.manager.resources.fonts["Orbitron_Regular.json"],
      size: 74,
    })
    subTitleG.computeBoundingBox()
    this.subTitle = new Mesh(subTitleG, new MeshBasicMaterial({
      color: 0xffffff
    }))
    this.subTitle.position.x = -0.5 * (subTitleG.boundingBox.max.x
        - subTitleG.boundingBox.min.x)
    this.subTitle.position.y = 20
    this.subTitle.scale.set(1, 0.8, 1)

    // press start
    const pressStartG = new TextGeometry('PRESS START', {
      font: this.manager.resources.fonts["Orbitron_Regular.json"],
      size: 40,
    })
    pressStartG.computeBoundingBox()
    const presStartM = new MeshBasicMaterial({color: 0xffffff})
    presStartM.transparent = true
    this.pressStart = new Mesh(pressStartG, presStartM)
    this.pressStart.position.x = -0.5 * (pressStartG.boundingBox.max.x
        - pressStartG.boundingBox.min.x)
    this.pressStart.position.y = -200
    this.pressStart.scale.set(1, 1, 1)

    // loginForm
    const loginFormElem = document.getElementById("login")
    this.loginForm = new CSS3DObject(loginFormElem)
    this.loginForm.position.x = 0
    this.loginForm.position.y = -100

  }

  clearCanvas = () => {
    this.manager.context.scene.remove(this.mainTitle)
    this.manager.context.scene.remove(this.subTitle)
    this.manager.context.scene.remove(this.pressStart)
  }

  drawPressStart = () => {
    this.manager.context.scene.add(this.mainTitle)
    this.manager.context.scene.add(this.subTitle)
    this.manager.context.scene.add(this.pressStart)
    const tween = new Tween(this.pressStart.material)
    .to({opacity: 0}, 800)
    .yoyo(true)
    .repeat(Infinity)
    tween.start()
  }

  drawNeedUserLogin = () => {
    this.manager.context.scene.add(this.mainTitle)
    this.manager.context.scene.add(this.subTitle)

    // todo - loginForm
    this.manager.context.scene.add(this.loginForm)
  }

  destroy = () => {

  }
}