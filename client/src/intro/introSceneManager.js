import ResourceLoader from "../common/resourceLoader";
import introResources from "./introResources.json"
import * as TWEEN from "@tweenjs/tween.js";
import IntroSceneKeyboard from "./introSceneKeyboard";
import IntroSceneView from "./introSceneView";
import {INTRO_SCENE_STATE} from "./introSceneState";

export default class IntroSceneManager {

  constructor(ctx) {
    this.context = ctx;
  }

  init = async () => {
    // load resources
    this.resources = introResources
    const loader = new ResourceLoader(this.context)
    await loader.load(this.resources)

    // init view
    this.view = new IntroSceneView(this)
    this.view.init()

    // init keyboard
    this.keyboard = new IntroSceneKeyboard(this)
    this.keyboard.init()

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
      this.view.drawNeedUserLogin()
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
  }
}