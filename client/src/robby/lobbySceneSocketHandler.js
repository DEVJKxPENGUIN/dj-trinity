import * as serverHandler from "../common/serverHandler";

export default class LobbySceneSocketHandler {

  constructor(manager) {
    this.manager = manager
  }

  init = () => {
    this.socket = serverHandler.createSocket("/lobby", this.onOpen,
        this.onMessage,
        this.onClose)
  }

  onOpen = (e) => {
    console.log("onOpen : ", e)
    this.socket.send(JSON.stringify({
      type: "ENTER_CHANNEL",
    }))
  }

  onMessage = async (e) => {
    const message = JSON.parse(e.data)
    console.log("onMessage : ", message)
    if ("ENTER_CHANNEL" === message.type) {
      // 본인 입장
      if (!message.payload.userId) {
        await this.manager.enterChannel(message.payload)
        return
      }

      // 타인 입장
      if (message.payload.userId) {
        await this.manager.updateChannel(message.payload)
        return
      }
    }

    if("CHAT_MESSAGE" === message.type) {
      await this.manager.updateChatBox(message.payload)
      return
    }

  }

  onClose = (e) => {
    console.log("onClose : ", e)
  }

  destroy = () => {
    this.socket.close()
  }
}