export default class LobbyCanvas {

  constructor() {
  }

  async init(ctx) {
    this.ctx = ctx

    // todo!!!
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 3000)
    })
  }

}