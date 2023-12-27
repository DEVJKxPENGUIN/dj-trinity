import {Audio} from "three";

export default class IntroSceneSound {

  constructor(manager) {
    this.manager = manager
  }

  init = () => {

  }

  beep = () => {
    const sound = new Audio(this.manager.context.listener)
    sound.setBuffer(this.manager.resources.sounds["sound/beep1.wav"])
    sound.setLoop(false)
    sound.setVolume(1)
    sound.play()
  }

  beep2 = () => {
    const sound = new Audio(this.manager.context.listener)
    sound.setBuffer(
        this.manager.resources.sounds["sound/beep2.wav"])
    sound.setLoop(false)
    sound.setVolume(1)
    sound.play()
  }

  select = () => {
    const sound = new Audio(this.manager.context.listener)
    sound.setBuffer(
        this.manager.resources.sounds["sound/select.wav"])
    sound.setLoop(false)
    sound.setVolume(1)
    sound.play()
  }

  startBackground = () => {
    if (this.backgroundSound === null || this.backgroundSound === undefined) {
      this.backgroundSound = new Audio(this.manager.context.listener)
      this.backgroundSound.setBuffer(
          this.manager.resources.sounds["sound/Refresh.mp3"])
      this.backgroundSound.setLoop(true)
      this.backgroundSound.setVolume(1)
    }

    if (this.backgroundSound.isPlaying) {
      console.log('playing')
      return
    }
    this.backgroundSound.play()
  }

  destroy = () => {
    if (this.backgroundSound.isPlaying) {
      this.backgroundSound.stop()
    }
    if (this.backgroundSound.buffer) {
      this.backgroundSound.setBuffer(null)
    }
    this.backgroundSound.disconnect()
    this.backgroundSound = null
  }
}