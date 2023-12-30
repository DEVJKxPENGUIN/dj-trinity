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

  onMessage = (e) => {
    const message = JSON.parse(e.data)
    console.log("onMessage : ", message)
    if("ENTER_CHANNEL" === message.type){
      this.manager.enterChannel(message.payload)
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