import {Audio} from "three";

export default class BackgroundSoundHandler {

  constructor(ctx) {
    this.context = ctx

  }

  start = () => {
    console.log('backgroundsound play')
    if (this.backgroundSound === null || this.backgroundSound === undefined) {
      this.backgroundSound = new Audio(this.context.listener)
      this.backgroundSound.setBuffer(
          this.context.commonResources.sounds["sound/Refresh.mp3"])
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