import {createSocket} from "@/manager/apiManager";
import {ComponentPublicInstance} from "vue";
import AppManager from "@/manager/AppManager";
import Socket from "@/scene/common/Socket";

export default class LobbySocket implements Socket {
  vue: ComponentPublicInstance
  ctx: AppManager | undefined
  socket: WebSocket | undefined;

  constructor(vue: ComponentPublicInstance) {
    this.vue = vue
  }


  async init(ctx: AppManager) {
    this.ctx = ctx

    this.socket = createSocket('/lobby', () => {
      this.socket?.send(JSON.stringify({
        type: "ENTER_CHANNEL"
      }))
    }, async (e: any) => {
      const message = JSON.parse(e.data)
      const vue = this.vue as any
      console.log('onMessage : ', message)
      if ("ENTER_CHANNEL" === message.type) {
        // 본인 입장
        if (!message.payload.userId) {
          await vue.enterChannel(message.payload)
          return
        }

        // 타인 입장
        if (message.payload.userId) {
          await vue.updateChannel(message.payload)
          return
        }
      }

      if ("CHAT_MESSAGE" === message.type) {
        await vue.updateChatBox(message.payload)
        return
      }

      if ("EXIT_CHANNEL" === message.type) {
        await vue.updateChannel(message.payload)
        return
      }
    }, (e: any) => {
      console.log('socket connection closed')
    })
  }

  sendChat(nickname: string, chatMessage: string) {
    this.socket?.send(JSON.stringify({
      type: "CHAT_MESSAGE",
      payload: {
        message: chatMessage,
        nickname: nickname
      }
    }))
  }

  destroy() {
    this.socket?.close()
  }
}