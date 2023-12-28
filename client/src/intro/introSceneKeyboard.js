export default class IntroSceneKeyboard {

  constructor(scene) {
    this.scene = scene
  }

  init = () => {
    document.addEventListener("keydown", this.handleKeydown)
  }

  handleKeydown = (e) => {
    if (e.key === "Enter") {
      this.scene.goNextState()
    } else if(e.key === "ArrowUp") {
      this.scene.prevFocus()
    } else if(e.key === "ArrowDown") {
      this.scene.nextFocus()
    } else if(e.key === "ArrowRight") {
    } else if(e.key === "ArrowLeft") {
    } else if(e.key === "Backspace") {

    }else if(e.key === "Escape") {
      this.scene.goPrevState()
    }

  }

  destroy = () => {
    document.removeEventListener("keydown", this.handleKeydown, true)
  }
}