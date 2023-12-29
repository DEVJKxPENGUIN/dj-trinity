import {Audio} from "three";

export default class IntroSceneSound {

  constructor(manager) {
    this.manager = manager
  }

  init = () => {

  }

  beep = () => {
    const sound = new Audio(this.manager.context.listener)
    sound.setBuffer(
        this.manager.context.commonResources.sounds["sound/beep1.wav"])
    sound.setLoop(false)
    sound.setVolume(1)
    sound.play()
  }

  beep2 = () => {
    const sound = new Audio(this.manager.context.listener)
    sound.setBuffer(
        this.manager.context.commonResources.sounds["sound/beep2.wav"])
    sound.setLoop(false)
    sound.setVolume(1)
    sound.play()
  }

  select = () => {
    const sound = new Audio(this.manager.context.listener)
    sound.setBuffer(
        this.manager.context.commonResources.sounds["sound/select.wav"])
    sound.setLoop(false)
    sound.setVolume(1)
    sound.play()
  }

  destroy = () => {
  }
}