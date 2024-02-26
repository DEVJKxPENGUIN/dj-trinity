export default class LobbyCanvas {

  constructor(ctx) {
    this.ctx = ctx
  }

  async init() {
    // todo!!!
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 3000)
    })
  }

}