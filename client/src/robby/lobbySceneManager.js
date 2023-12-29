import ResourceLoader from "../common/resourceLoader";
import robbyResources from "./lobbyResources.json"
import LobbySceneView from "./lobbySceneView";
import LobbySceneSound from "./lobbySceneSound";
import LobbySceneKeyboard from "./lobbySceneKeyboard";
import {ROBBY_SCENE_STATE} from "./lobbySceneState";
import * as authenticationHandler from "../common/authenticationHandler"

export default class LobbySceneManager {

  constructor() {
  }

  init = async (ctx) => {
    this.context = ctx
    this.isDestroy = false

    // load resources
    this.resources = robbyResources
    const loader = new ResourceLoader(this.context)
    await loader.load(this.resources)

    // init view
    this.view = new LobbySceneView(this)
    this.view.init()

    // init keyboard
    this.keyboard = new LobbySceneKeyboard(this)
    this.keyboard.init()

    // init sound
    this.sound = new LobbySceneSound(this)
    this.sound.init()

    // init game state
    this.goNextState()

    // start animate
    this.animate()
  }

  goNextState = () => {
    if (this.state === undefined) {
      this.goChatRoom()
    }

  }

  goChatRoom = () => {
    this.view.clearCanvas()
    this.state = ROBBY_SCENE_STATE.CHAT_ROOM
    this.view.drawChatRoom()
  }

  animate = () => {
    if (this.isDestroy) {
      return
    }
    requestAnimationFrame(this.animate);
    this.context.draw()
  }

  destroy = () => {
    this.view.destroy()
    this.keyboard.destroy()
    this.sound.destroy()
    this.isDestroy = true
  }
}