import ResourceLoader from "../common/resourceLoader";
import lobbyResources from "./lobbyResources.json"
import LobbySceneView from "./lobbySceneView";
import LobbySceneSound from "./lobbySceneSound";
import LobbySceneKeyboard from "./lobbySceneKeyboard";
import {ROBBY_SCENE_STATE} from "./lobbySceneState";
import LobbySceneSocketHandler from "./lobbySceneSocketHandler";
import * as serverHandler from "../common/serverHandler";

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

    // init default state
    this.showUsers = []
    this.showChats = []
    this.chatInputText = ''

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
    this.updateShowUsers(0)
    this.view.drawChatRoom()
  }

  enterChannel = async (channelInfo) => {
    // beep
    this.sound.beep()
    this.context.info.channel.id = channelInfo.channelId
    await this.updateChannel(channelInfo)
  }

  updateChannel = async (channelInfo) => {
    this.context.info.channel.users = await serverHandler.get('/users',
        {userIds: channelInfo.users.join(',')})

    for (let i = 0; i < this.context.info.channel.users.length; i++) {
      const user = this.context.info.channel.users[i]
      if (!this.resources.textures[user.profile]) {
        this.resources.textures[user.profile] = null
      }
    }

    const loader = new ResourceLoader(this.context)
    await loader.load(this.resources)

    console.log('update channels : ', this.context.info)
    this.updateShowUsers(0)
    this.view.updateTextGeometries()
  }

  updateChatBox = async (receivedChat) => {
    this.context.info.channel.chats.push(receivedChat)

    this.updateChats(2)
    this.view.updateTextGeometries()
  }

  updateShowUsers = (pageIndex) => {
    this.showUsers = this.context.info.channel.users.filter(
        user => user.id !== this.context.info.user.id).slice(pageIndex * 10,
        (pageIndex + 1) * 10)
  }

  updateChats = (bottomIndex) => {
    const maxShowSize = 8
    const chatLength = this.context.info.channel.chats.length
    const startIndex = chatLength - bottomIndex - maxShowSize
    const endIndex = chatLength - bottomIndex

    if (startIndex < 0) {
      this.showChats = this.context.info.channel.chats.slice(0, maxShowSize)
      return
    }

    this.showChats = this.context.info.channel.chats.slice(startIndex, endIndex)
  }

  addChatInput = (input) => {
    if (!this.view.isChatInputOpen()) {
      return
    }
    this.chatInputText += input
    this.view.updateTextGeometries()
  }

  sendChat = () => {
    this.socketHandler.sendChat(this.chatInputText)
    this.sound.beep()
    this.chatInputText = ''
    this.view.updateTextGeometries()
  }

  toggleChatInput = () => {
    if(!this.view.isChatInputOpen()) {
      this.sound.beep()
    }
    this.view.toggleChatInput()
  }

  handleEnter = () => {
    if(this.view.isChatInputOpen()) {
      this.sendChat()
      this.toggleChatInput()
      return
    }
  }

  handleBackspace = () => {
    if (this.view.isChatInputOpen()) {
      this.chatInputText = this.chatInputText.slice(0, -1)
      this.view.updateTextGeometries()
      return
    }

  }

  handleEscape = () => {
    if (this.view.isChatInputOpen()) {
      this.toggleChatInput()
      return
    }
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