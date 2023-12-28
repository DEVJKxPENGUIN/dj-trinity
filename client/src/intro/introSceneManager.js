import ResourceLoader from "../common/resourceLoader";
import introResources from "./introResources.json"
import * as TWEEN from "@tweenjs/tween.js";
import IntroSceneKeyboard from "./introSceneKeyboard";
import IntroSceneView from "./introSceneView";
import {INTRO_SCENE_STATE} from "./introSceneState";
import IntroSceneSound from "./introSceneSound";
import * as serverHandler from "../common/serverHandler";

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
    this.goNextState()

    // start animate
    this.animate()
  }

  goNextState = () => {
    if (this.state === undefined) {
      this.goPressStart()
    } else if (this.state === INTRO_SCENE_STATE.PRESS_START) {
      this.sound.select()
      this.sound.startBackground()
      this.goNeedUserLogin()
    } else if (this.state === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
      if (this.view.getCurrentFocus(this.view.loginForm) === 0) { // first element is signup state
        this.sound.select()
        this.goSignup()
        return
      }
      if (this.view.getCurrentFocus(this.view.loginForm) === 3) { // fourth element is login state
        const message = this.checkLoginValidation()
        if (message !== "ok") {
          this.sound.beep2()
          this.view.vibrate(this.view.loginForm, message)
          return
        }
        this.sound.select()
        this.goRequesting(() => {
          // todo - login
        })
        return
      }
    } else if (this.state === INTRO_SCENE_STATE.SIGN_UP) {
      if (this.view.getCurrentFocus(this.view.signupForm) === 3) { // fourth element is signup request state
        const message = this.checkSignupValidation()
        if (message !== "ok") {
          this.sound.beep2()
          this.view.vibrate(this.view.signupForm, message)
          return
        }
        const signupInfo = this.view.getSignupInfo()
        this.sound.select()
        this.goRequesting(() => {
              serverHandler.post('/user', signupInfo, (data) => {
                this.popupSystemMessage("SUCCESS! NOW.. LOGIN TO PLAY",
                    INTRO_SCENE_STATE.NEED_USER_LOGIN,
                    INTRO_SCENE_STATE.NEED_USER_LOGIN)
              }, (message) => {
                this.popupSystemMessage(message, INTRO_SCENE_STATE.SIGN_UP,
                    INTRO_SCENE_STATE.SIGN_UP)
              })
            }
        )
        return
      }
    } else if (this.state === INTRO_SCENE_STATE.SYSTEM_MESSAGE) {
      if (!this.nextState) {
        this.sound.beep2()
        this.goPressStart()
        return
      }
      if (this.nextState === INTRO_SCENE_STATE.SIGN_UP) {
        this.sound.beep2()
        this.goSignup()
        return
      }
      if (this.nextState === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
        this.sound.beep2()
        this.goNeedUserLogin()
        return
      }
    }
  }

  goPrevState = () => {
    if (this.state === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
      this.sound.beep2()
      this.goPressStart()
    } else if (this.state === INTRO_SCENE_STATE.SIGN_UP) {
      this.sound.beep2()
      this.goNeedUserLogin()
    } else if (this.state === INTRO_SCENE_STATE.SYSTEM_MESSAGE) {
      if (!this.prevState) {
        this.sound.beep2()
        this.goPressStart()
        return
      }
      if (this.prevState === INTRO_SCENE_STATE.SIGN_UP) {
        this.sound.beep2()
        this.goSignup()
        return
      }
      if (this.prevState === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
        this.sound.beep2()
        this.goNeedUserLogin()
        return
      }
    }
  }

  goPressStart = () => {
    this.view.clearCanvas()
    this.state = INTRO_SCENE_STATE.PRESS_START
    this.view.drawPressStart()
  }

  goNeedUserLogin = () => {
    this.view.clearCanvas()
    this.state = INTRO_SCENE_STATE.NEED_USER_LOGIN
    this.view.drawNeedUserLogin()
  }

  goSignup = () => {
    this.view.clearCanvas()
    this.state = INTRO_SCENE_STATE.SIGN_UP
    this.view.drawSignUp()
  }

  goRequesting = (action) => {
    this.view.clearCanvas()
    this.state = INTRO_SCENE_STATE.REQUESTING
    this.view.drawRequesting()
    action()
  }

  nextFocus = () => {
    if (this.state === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
      let currentIndex = this.view.getCurrentFocus(this.view.loginForm)
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusTarget(this.view.loginForm, currentIndex)
      } else if (currentIndex !== this.view.getCurrentElemSize(
              this.view.loginForm)
          - 1) {
        currentIndex++
        this.sound.beep()
        this.view.focusTarget(this.view.loginForm, currentIndex)
      }
    } else if (this.state === INTRO_SCENE_STATE.SIGN_UP) {
      let currentIndex = this.view.getCurrentFocus(this.view.signupForm)
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusTarget(this.view.signupForm, currentIndex)
      } else if (currentIndex !== this.view.getCurrentElemSize(
          this.view.signupForm) - 1) {
        currentIndex++
        this.sound.beep()
        this.view.focusTarget(this.view.signupForm, currentIndex)
      }
    } else if (this.state === INTRO_SCENE_STATE.ERROR) {
      let currentIndex = this.view.getCurrentFocus(this.view.systemMessage)
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusTarget(this.view.systemMessage, currentIndex)
      } else if (currentIndex !== this.view.getCurrentElemSize(
          this.view.systemMessage) - 1) {
        currentIndex++
        this.sound.beep()
        this.view.focusTarget(this.view.systemMessage, currentIndex)
      }
    }
  }

  prevFocus = () => {
    if (this.state === INTRO_SCENE_STATE.NEED_USER_LOGIN) {
      let currentIndex = this.view.getCurrentFocus(this.view.loginForm)
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusTarget(this.view.loginForm, currentIndex)
      } else if (currentIndex !== 0) {
        currentIndex--
        this.sound.beep()
        this.view.focusTarget(this.view.loginForm, currentIndex)
      }
    } else if (this.state === INTRO_SCENE_STATE.SIGN_UP) {
      let currentIndex = this.view.getCurrentFocus(this.view.signupForm)
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusTarget(this.view.signupForm, currentIndex)
      } else if (currentIndex !== 0) {
        currentIndex--
        this.sound.beep()
        this.view.focusTarget(this.view.signupForm, currentIndex)
      }
    } else if (this.state === INTRO_SCENE_STATE.ERROR) {
      let currentIndex = this.view.getCurrentFocus(this.view.systemMessage)
      if (currentIndex === null) {
        currentIndex = 0
        this.sound.beep()
        this.view.focusTarget(this.view.systemMessage, currentIndex)
      } else if (currentIndex !== 0) {
        currentIndex--
        this.sound.beep()
        this.view.focusTarget(this.view.systemMessage, currentIndex)
      }
    }
  }

  popupSystemMessage = (message, nextState, prevState) => {
    this.view.clearCanvas()
    this.state = INTRO_SCENE_STATE.SYSTEM_MESSAGE
    this.nextState = nextState
    this.prevState = prevState
    this.sound.beep2()
    this.view.drawSystemMessage()
    this.view.vibrate(this.view.systemMessage, message)
  }

  checkLoginValidation = () => {
    const loginInfo = this.view.getLoginInfo()
    if (!loginInfo.id || !loginInfo.password) {
      return "Your input is empty"
    }
    if (!/^[a-zA-Z0-9]{3,20}$/.test(loginInfo.id)) {
      return "Id should be 3 - 20(length), only a-Z, 0-9"
    }
    if (!(loginInfo.password.length >= 8 && loginInfo.password.length <= 20)) {
      return "Password length should be 8 - 20"
    }
    return "ok"
  }

  checkSignupValidation = () => {
    const signupInfo = this.view.getSignupInfo()
    if (!signupInfo.id || !signupInfo.password
        || !signupInfo.passwordCheck) {
      return "Your input is empty"
    }
    if (!/^[a-zA-Z0-9]{3,20}$/.test(signupInfo.id)) {
      return "Id should be 3 - 20(length), only a-Z, 0-9"
    }
    if (signupInfo.password !== signupInfo.passwordCheck) {
      return "Password is different"
    }
    if (!(signupInfo.password.length >= 8 && signupInfo.password.length
        <= 20)) {
      return "Password should be 8 - 20(length)"
    }
    return "ok"
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