import {createSocket} from "@/manager/apiManager";

export default class LobbySocket {

  constructor(vue) {
    this.vue = vue
  }

  async init(ctx) {
    this.ctx = ctx

    this.socket = createSocket('/lobby', () => {
      this.socket.send(JSON.stringify({
        type: "ENTER_CHANNEL"
      }))
    }, async (e) => {
      const message = JSON.parse(e.data)
      console.log('onMessage : ', message)
      if ("ENTER_CHANNEL" === message.type) {
        // 본인 입장
        if (!message.payload.userId) {
          await this.vue.enterChannel(message.payload)
          return
        }

        // 타인 입장
        if (message.payload.userId) {
          await this.vue.updateChannel(message.payload)
          return
        }
      }

      if ("CHAT_MESSAGE" === message.type) {
        await this.vue.updateChatBox(message.payload)
        return
      }

      if ("EXIT_CHANNEL" === message.type) {
        await this.vue.updateChannel(message.payload)
        return
      }
    }, (e) => {
      console.log('socket connection closed')
    })
  }

  sendChat(nickname, chatMessage) {
    this.socket.send(JSON.stringify({
      type: "CHAT_MESSAGE",
      payload: {
        message: chatMessage,
        nickname: nickname
      }
    }))
  }

  destroy() {
    this.socket.close()
  }
}