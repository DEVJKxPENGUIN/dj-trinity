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
      this.manager.handleArrowUp()
    } else if (e.key === "ArrowDown") {
      this.manager.handleArrowDown()
    } else if (e.key === "ArrowRight") {
      this.manager.handleArrowRight()
    } else if (e.key === "ArrowLeft") {
      this.manager.handleArrowLeft()
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