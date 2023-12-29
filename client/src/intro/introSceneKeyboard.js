export default class IntroSceneKeyboard {

  constructor(manager) {
    this.manager = manager
  }

  init = () => {
    document.addEventListener("keydown", this.handleKeydown)
  }

  handleKeydown = (e) => {
    if (e.key === "Enter") {
      this.manager.goNextState()
    } else if(e.key === "ArrowUp") {
      this.manager.prevFocus()
    } else if(e.key === "ArrowDown") {
      this.manager.nextFocus()
    } else if(e.key === "ArrowRight") {
    } else if(e.key === "ArrowLeft") {
    } else if(e.key === "Backspace") {

    }else if(e.key === "Escape") {
      this.manager.goPrevState()
    }

  }

  destroy = () => {
    document.removeEventListener("keydown", this.handleKeydown, true)
  }
}