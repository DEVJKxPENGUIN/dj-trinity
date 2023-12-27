import ResourceLoader from "../common/resourceLoader";
import introResources from "./introResources.json"
import * as TWEEN from "@tweenjs/tween.js";
import IntroSceneKeyboard from "./introSceneKeyboard";
import IntroSceneView from "./introSceneView";
import {INTRO_SCENE_STATE} from "./introSceneState";
import IntroSceneSound from "./introSceneSound";

export default class IntroSceneManager {

  constructor(ctx) {
    this.context = ctx;
  }

  init = async () => {
    // load resources
    this.resources = introResources
    const loader = new ResourceLoader(this.context)
    await loader.load(this.resources)
    console.log(this.resources)

    // init view
    this.view = new IntroSceneView(this)
    this.view.init()

    // init keyboard
    this.keyboard = new IntroSceneKeyboard(this)
    this.keyboard.init()

    // init sound
    this.sound = new IntroSceneSound(this)
    this.sound.init()

    // init game state
    this.nextState()

    // start animate
    this.animate()
  }

  nextState = () => {
    console.log('state changed : ', this.state)
    if (this.state === undefined) {
      this.view.clearCanvas()
      this.state = INTRO_SCENE_STATE.PRESS_START
      this.view.drawPressStart()
    } else if (this.state === INTRO_SCENE_STATE.PRESS_START) {
      this.view.clearCanvas()
      this.state = INTRO_SCENE_STATE.NEED_USER_LOGIN
      this.sound.select()
      this.sound.startBackground()
      this.view.drawNeedUserLogin()
    } else if (this.state === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
      if(this.view.getCurrentNeedUserLoginFocus() === 0) { // first element is signup state
        this.view.clearCanvas()
        this.state = INTRO_SCENE_STATE.SIGN_UP
        this.sound.select()
        this.view.drawSignUp()
        return
      }
      if(this.view.getCurrentNeedUserLoginFocus() === 3) { // fourth element is login state
        // todo
        return
      }
    }
  }

  prevState = () => {
    if (this.state === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
      this.view.clearCanvas()
      this.state = INTRO_SCENE_STATE.PRESS_START
      this.sound.beep2()
      this.view.drawPressStart()
    } else if (this.state === INTRO_SCENE_STATE.SIGN_UP) {
      this.view.clearCanvas()
      this.state = INTRO_SCENE_STATE.NEED_USER_LOGIN
      this.sound.beep2()
      this.view.drawNeedUserLogin()
    }

  }

  nextFocus = () => {
    if (this.state === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
      let currentIndex = this.view.getCurrentNeedUserLoginFocus()
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusNeedUserLogin(currentIndex)
      } else if (currentIndex !== this.view.getCurrentNeedUserLoginElemSize()
          - 1) {
        currentIndex++
        this.sound.beep()
        this.view.focusNeedUserLogin(currentIndex)
      }
    } else if (this.state === INTRO_SCENE_STATE.SIGN_UP) {
      let currentIndex = this.view.getCurrentSignupFocus()
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusSignup(currentIndex)
      } else if (currentIndex !== this.view.getCurrentSignupElemSize() - 1) {
        currentIndex++
        this.sound.beep()
        this.view.focusSignup(currentIndex)
      }
      console.log(currentIndex)
    }
  }

  prevFocus = () => {
    if (this.state === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
      let currentIndex = this.view.getCurrentNeedUserLoginFocus()
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusNeedUserLogin(currentIndex)
      } else if (currentIndex !== 0) {
        currentIndex--
        this.sound.beep()
        this.view.focusNeedUserLogin(currentIndex)
      }
    } else if (this.state === INTRO_SCENE_STATE.SIGN_UP) {
      let currentIndex = this.view.getCurrentSignupFocus()
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusSignup(currentIndex)
      } else if (currentIndex !== 0) {
        currentIndex--
        this.sound.beep()
        this.view.focusSignup(currentIndex)
      }
      console.log(currentIndex)
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    TWEEN.update()
    this.context.draw()
  }

  destroy = () => {
    this.view.destroy()
    this.keyboard.destroy()
    this.state.destroy()
    this.sound.destroy()
  }
}