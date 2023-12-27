import {Mesh, MeshBasicMaterial} from "three";
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
  }

  clearCanvas = () => {
    this.manager.context.scene.remove(this.mainTitle)
    this.manager.context.scene.remove(this.subTitle)
    this.manager.context.scene.remove(this.pressStart)
    this.manager.context.scene.remove(this.loginForm)
    this.manager.context.scene.remove(this.signupForm)
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

  getCurrentNeedUserLoginFocus = () => {
    const elems = this.loginForm.element.querySelectorAll(".operation")
    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i]
      if (document.activeElement === elem) {
        return i
      }
    }
    return null
  }

  getCurrentNeedUserLoginElemSize = () => {
    return this.loginForm.element.querySelectorAll(".operation").length
  }

  getCurrentSignupFocus = () => {
    const elems = this.signupForm.element.querySelectorAll(".operation")
    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i]
      if (document.activeElement === elem) {
        return i
      }
    }
    return null
  }

  getCurrentSignupElemSize = () => {
    return this.signupForm.element.querySelectorAll(".operation").length
  }

  focusNeedUserLogin = (index) => {
    const elems = this.loginForm.element.querySelectorAll(".operation")
    if (elems[index].tagName === "INPUT") {
      setTimeout(() => {
        elems[index].select()
      }, 10)
    }
    elems[index].focus()
  }

  focusSignup = (index) => {
    const elems = this.signupForm.element.querySelectorAll(".operation")
    if (elems[index].tagName === "INPUT") {
      setTimeout(() => {
        elems[index].select()
      }, 10)
    }
    elems[index].focus()
  }

  destroy = () => {

  }
}