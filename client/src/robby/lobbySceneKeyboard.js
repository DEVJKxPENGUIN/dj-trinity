export default class LobbySceneKeyboard {
  constructor(manager) {
    this.manager = manager
  }

  init = () => {
    document.addEventListener("keydown", this.handleKeydown)
  }

  handleKeydown = (e) => {
    if (e.key === "Enter") {
      if(e.shiftKey) {
        this.manager.toggleChatInput()
        return
      }
      this.manager.handleEnter()
    } else if (e.key === "ArrowUp") {
    } else if (e.key === "ArrowDown") {
    } else if (e.key === "ArrowRight") {
    } else if (e.key === "ArrowLeft") {
    } else if (e.key === "Backspace") {
      this.manager.handleBackspace()
    } else if (e.key === "Escape") {
      this.manager.handleEscape()
    } else if (e.key.length === 1) { // common typed input
      this.manager.addChatInput(e.key)
    }
  }

  destroy = () => {
    document.removeEventListener("keydown", this.handleKeydown, true)
  }
}