export default class LobbySceneKeyboard {
  constructor(manager) {
    this.manager = manager
  }

  init = () => {
    document.addEventListener("keydown", this.handleKeydown)
  }

  handleKeydown = (e) => {
    if (e.key === "Enter") {
    } else if (e.key === "ArrowUp") {
    } else if (e.key === "ArrowDown") {
    } else if (e.key === "ArrowRight") {
    } else if (e.key === "ArrowLeft") {
    } else if (e.key === "Backspace") {

    } else if (e.key === "Escape") {
    }
  }

  destroy = () => {
    document.removeEventListener("keydown", this.handleKeydown, true)
  }
}