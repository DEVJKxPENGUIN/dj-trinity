
export default class LobbySceneView {

  constructor(manager) {
    this.manager = manager
    this.info = this.manager.context.info
  }

  init = () => {
    const commonResources = this.manager.context.commonResources

  }

  clearCanvas = () => {

  }

  drawChatRoom = () => {

  }

  toggleChatInput = () => {
    if (this.isChatInputOpen()) {
      // todo
      return
    }
  }

  isChatInputOpen = () => {
    return false; // todo
  }

  updateTextGeometries = () => {

  }

  destroy = () => {

  }
}
