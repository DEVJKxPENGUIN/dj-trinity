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

    console.log('loader : {}', this.resources)

    // init default state
    this.showUsers = []
    this.showChats = []
    this.showChatBottomIndex = 0
    this.chatInputText = ''
    this.showBms = []
    this.showBmsIndex = 0
    this.bmsDetailIndex = 0 // todo -> 여기서부터, bms 세부선택 화면 그려야 한다.
    this.currentBms = []
    this.updateBms()

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

    this.updateChats(0)
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

  updateBms = () => {
    this.showBms = {}
    const maxShowSize = 17
    const bmsList = Object.keys(this.resources["bms-meta"])
    const length = bmsList.length
    // upper
    const half = (maxShowSize - 1) / 2
    let startIndex = this.showBmsIndex - half;
    if (this.showBmsIndex - half < 0) {
      startIndex = length + (this.showBmsIndex - half)
    }
    for (let i = 0; i < half; i++) {
      let index = startIndex + i
      if (startIndex + i >= length) {
        index = startIndex + i - length
      }
      this.showBms[bmsList[index]] = this.resources["bms-meta"][bmsList[index]]
    }
    // current
    this.showBms[bmsList[this.showBmsIndex]] = this.resources["bms-meta"][bmsList[this.showBmsIndex]]
    this.currentBms = this.resources["bms-meta"][bmsList[this.showBmsIndex]][this.bmsDetailIndex]

    // bottom
    for (let i = 0; i < half; i++) {
      let index = this.showBmsIndex + i + 1
      if (this.showBmsIndex + i + 1 >= length) {
        index = this.showBmsIndex + i + 1 - length
      }
      this.showBms[bmsList[index]] = this.resources["bms-meta"][bmsList[index]]
    }
  }

  addChatInput = (input) => {
    if (!this.view.isChatInputOpen()) {
      return
    }
    this.chatInputText += input
    this.view.updateTextGeometries()
  }

  sendChat = () => {
    this.socketHandler.sendChat(this.context.info.user.nickname,
        this.chatInputText)
    this.sound.beep()
    this.chatInputText = ''
    this.view.updateTextGeometries()
  }

  toggleChatInput = () => {
    if (!this.view.isChatInputOpen()) {
      this.sound.beep()
    }
    this.view.toggleChatInput()
  }

  handleEnter = () => {
    if (this.view.isChatInputOpen()) {
      this.sendChat()
      this.toggleChatInput()
      return
    }
  }

  handleArrowUp = () => {
    this.sound.beep()
    if (this.showBmsIndex === Object.keys(this.resources["bms-meta"]).length
        - 1) {
      this.showBmsIndex = 0
    } else {
      this.showBmsIndex++
    }
    this.bmsDetailIndex = 0
    this.updateBms()
    this.view.updateTextGeometries()
  }

  handleArrowDown = () => {
    this.sound.beep()
    if (this.showBmsIndex === 0) {
      this.showBmsIndex = Object.keys(this.resources["bms-meta"]).length - 1
    } else {
      this.showBmsIndex--
    }
    this.bmsDetailIndex = 0
    this.updateBms()
    this.view.updateTextGeometries()
  }

  handleArrowRight = () => {
    this.sound.beep()
    const length = this.resources["bms-meta"][Object.keys(
        this.resources["bms-meta"])[this.showBmsIndex]].length
    this.bmsDetailIndex = (this.bmsDetailIndex + 1) > length - 1 ? length - 1
        : this.bmsDetailIndex + 1
    this.updateBms()
    this.view.updateTextGeometries()
  }

  handleArrowLeft = () => {
    this.sound.beep()
    const length = this.resources["bms-meta"][Object.keys(
        this.resources["bms-meta"])[this.showBmsIndex]].length
    this.bmsDetailIndex = (this.bmsDetailIndex - 1) < 0 ? 0
        : this.bmsDetailIndex - 1
    this.updateBms()
    this.view.updateTextGeometries()
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