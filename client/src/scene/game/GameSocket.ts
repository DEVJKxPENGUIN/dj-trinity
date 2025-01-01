import {createSocket} from "@/manager/apiManager";
import {ComponentPublicInstance} from "vue";
import AppManager from "@/manager/AppManager";

export default class GameSocket {
  vue: ComponentPublicInstance
  ctx: AppManager | undefined

  constructor(vue:ComponentPublicInstance) {
    this.vue = vue
  }

  async init(ctx:AppManager) {
    this.ctx = ctx

    // todo
    // this.socket = createSocket('/game', () => {
    //   this.socket.send(JSON.stringify({
    //     // type: "TODO"
    //   }))
    // }, async (e) => {
    //   // todo - onMessage
    // }, (e) => {
    //   console.log('socket connection closed')
    // })
  }

  destroy() {
    // todo
    // this.socket.close()
  }
}