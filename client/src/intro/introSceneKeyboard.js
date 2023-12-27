export default class IntroSceneKeyboard {

  constructor(scene) {
    this.scene = scene
  }

  init = () => {
    document.addEventListener("keydown", this.handleKeydown)

  }

  handleKeydown = (e) => {
    if (e.key === "Enter") {
      console.log('enter pressed')
      this.scene.nextState()
    }
  }

  destroy = () => {
    document.removeEventListener("keydown", this.handleKeydown, true)
  }
}