import ResourceLoader from "../common/resourceLoader";
import lobbyResources from "./lobbyResources.json"
import LobbySceneView from "./lobbySceneView";
import LobbySceneSound from "./lobbySceneSound";
import LobbySceneKeyboard from "./lobbySceneKeyboard";
import {ROBBY_SCENE_STATE} from "./lobbySceneState";
import LobbySceneSocketHandler from "./lobbySceneSocketHandler";

export default class LobbySceneManager {

  constructor() {
  }

  init = async (ctx) => {
    this.context = ctx
    this.isDestroy = false

    console.log('userInfo : {}', this.context.info.user)

    // load resources
    this.resources = lobbyResources
    this.resources.textures[this.context.info.user.profile] = null
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

    // init socket
    this.socketHandler = new LobbySceneSocketHandler(this)
    this.socketHandler.init()

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

  enterChannel = (channelInfo) => {
    // beep
    this.context.info.channel.id = channelInfo.channelId
    console.log(this.context.info)

    this.view.updateTextGeometries()
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