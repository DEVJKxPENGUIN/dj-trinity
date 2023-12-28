import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial
} from "three";
import {CSS3DObject, TextGeometry} from "three/addons";
import TWEEN, {Tween} from "@tweenjs/tween.js";

export default class IntroSceneView {

  constructor(manager) {
    this.manager = manager
  }

  init = () => {
    // title
    const mainTitleG = new TextGeometry('TRINITY', {
      font: this.manager.resources.fonts["font/Orbitron_Regular.json"],
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
      font: this.manager.resources.fonts["font/Orbitron_Regular.json"],
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
    const pressStartG = new TextGeometry('PRESS "ENTER" to START', {
      font: this.manager.resources.fonts["font/Orbitron_Regular.json"],
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
    this.loginForm.position.y = 0

    // signupForm
    const signupFormElem = document.getElementById("signup")
    this.signupForm = new CSS3DObject(signupFormElem)
    this.signupForm.position.x = 0
    this.signupForm.position.y = 0

    // requesting - testing instanceBufferGeometry
    const loadingCircleG = new BufferGeometry()
    const loadingCircleM = new PointsMaterial({color: 0xffffff, size: 15})
    loadingCircleM.transparent = true
    const loadingCircleSize = 4
    const loadingCirclePos = new Float32Array(loadingCircleSize * 3)
    for (let i = 0; i < loadingCircleSize; i++) {
      loadingCirclePos[i * 3] = i * 40    // x
      loadingCirclePos[i * 3 + 1] = -40     // y
      loadingCirclePos[i * 3 + 2] = 0     // z
    }
    loadingCircleG.setDrawRange(0, loadingCircleSize)
    loadingCircleG.setAttribute('position',
        new BufferAttribute(loadingCirclePos, 3).setUsage(DynamicDrawUsage))
    loadingCircleG.computeBoundingBox()
    this.loadingCircle = new Points(loadingCircleG, loadingCircleM)
    this.loadingCircle.position.x = -0.5 * (loadingCircleG.boundingBox.max.x
        - loadingCircleG.boundingBox.min.x)
    this.loadingCircle.position.y = -200

    // systemMessage
    const systemMessageElem = document.getElementById("systemMessage")
    this.systemMessage = new CSS3DObject(systemMessageElem)
    this.systemMessage.position.x = 0
    this.systemMessage.position.y = 0
  }

  clearCanvas = () => {
    this.manager.context.scene.remove(this.mainTitle)
    this.manager.context.scene.remove(this.subTitle)
    this.manager.context.scene.remove(this.pressStart)
    this.manager.context.scene.remove(this.loginForm)
    this.manager.context.scene.remove(this.signupForm)
    this.manager.context.scene.remove(this.loadingCircle)
    this.manager.context.scene.remove(this.systemMessage)

    this.loginForm.element.querySelector(".message").innerHTML = ''
    this.loginForm.element.querySelectorAll(".input").forEach(
        elem => elem.value = '')
    this.signupForm.element.querySelector(".message").innerHTML = ''
    this.signupForm.element.querySelectorAll(".input").forEach(
        elem => elem.value = '')
    this.systemMessage.element.querySelector(".message").innerHTML = ''
  }

  drawPressStart = () => {
    this.manager.context.scene.add(this.mainTitle)
    this.manager.context.scene.add(this.subTitle)
    this.manager.context.scene.add(this.pressStart)

    this.pressStart.material.opacity = 0
    new Tween(this.pressStart.material)
    .to({opacity: 1}, 800)
    .yoyo(true)
    .repeat(Infinity)
    .start()
  }

  drawNeedUserLogin = () => {
    this.manager.context.scene.add(this.mainTitle)
    this.manager.context.scene.add(this.subTitle)
    this.manager.context.scene.add(this.loginForm)

    setTimeout(() => {
      const elems = this.loginForm.element.querySelectorAll(".operation")
      elems[0].focus()
    }, 10)

    this.loginForm.position.y = -30
    new Tween(this.loginForm.position)
    .to({y: 0}, 300)
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
  }

  drawSignUp = () => {
    this.manager.context.scene.add(this.mainTitle)
    this.manager.context.scene.add(this.subTitle)
    this.manager.context.scene.add(this.signupForm)

    setTimeout(() => {
      const elems = this.signupForm.element.querySelectorAll(".operation")
      elems[0].focus()
    }, 10)

    this.signupForm.position.y = -30
    new Tween(this.signupForm.position)
    .to({y: 0}, 300)
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
  }

  drawRequesting = () => {
    this.manager.context.scene.add(this.mainTitle)
    this.manager.context.scene.add(this.subTitle)
    this.manager.context.scene.add(this.loadingCircle)

    this.loadingCircle.material.opacity = 0
    new Tween(this.loadingCircle.material)
    .to({opacity: 1}, 600)
    .yoyo(true)
    .repeat(Infinity)
    .start()
  }

  drawSystemMessage = () => {
    this.manager.context.scene.add(this.mainTitle)
    this.manager.context.scene.add(this.subTitle)
    this.manager.context.scene.add(this.systemMessage)

    setTimeout(() => {
      const elems = this.systemMessage.element.querySelectorAll(".operation")
      elems[0].focus()
    }, 10)
  }

  getCurrentFocus = (target) => {
    const elems = target.element.querySelectorAll(".operation")
    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i]
      if (document.activeElement === elem) {
        return i
      }
    }
    return null
  }

  getCurrentElemSize = (target) => {
    return target.element.querySelectorAll(".operation").length
  }

  getLoginInfo = () => {
    const elems = this.loginForm.element.querySelectorAll(".input")
    return {
      id: elems[0].value,
      password: elems[1].value,
    }
  }

  getSignupInfo = () => {
    const elems = this.signupForm.element.querySelectorAll(".input")
    return {
      id: elems[0].value,
      password: elems[1].value,
      passwordCheck: elems[2].value
    }
  }

  focusTarget = (target, index) => {
    const elems = target.element.querySelectorAll(".operation")
    if (elems[index].tagName === "INPUT") {
      setTimeout(() => {
        elems[index].select()
      }, 10)
    }
    elems[index].focus()
  }

  vibrate = (target, message) => {
    const messageDiv = target.element.querySelector(".message")
    messageDiv.innerHTML = `<p>${message}</p>`

    target.position.x = -2
    new Tween(target.position)
    .to({x: 2}, 50)
    .repeat(5)
    .yoyo(true)
    .onComplete(() => target.position.x = 0)
    .start()
  }

  destroy = () => {

  }
}