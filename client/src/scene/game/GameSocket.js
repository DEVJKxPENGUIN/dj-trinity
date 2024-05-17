import {createSocket} from "@/manager/apiManager";

export default class GameSocket {

  constructor(vue) {
    this.vue = vue
  }

  async init(ctx) {
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