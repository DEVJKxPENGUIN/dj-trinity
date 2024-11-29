import {RepeatWrapping, Sprite, SpriteMaterial} from "three";
import {gsap} from "gsap";

export default class SpriteHolder extends Sprite {

  constructor(texture, tilesX, tilesY, frame, width, height) {
    super(new SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    }));
    this.tilesX = tilesX
    this.tilesY = tilesY
    this.frame = frame
    this.currentY = tilesY
    this.offsetX = 0
    this.offsetY = tilesY * frame - 1
    this.scaleX = width
    this.scaleY = height
    this.scale.x = this.scaleX
    this.scale.y = this.scaleY

    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.needsUpdate = true;

    this.material.map.repeat.set(1 / tilesX, 1 / tilesY / frame)
    this.material.map.offset.x = this.offsetX
    this.material.map.offset.y = this.offsetY / (tilesY * frame)

    this.animate()
  }

  setCurrent(offsetX, offsetY) {
    this.offsetX = offsetX
    this.currentY = offsetY
    this.offsetY = this.currentY * this.frame - 1
    this.material.map.offset.x = this.offsetX
    this.material.map.offset.y = this.offsetY / (this.tilesY * this.frame)
  }

  setOpacity(opacity) {
    this.material.opacity = opacity
  }

  animate() {
    const tl = gsap.timeline({repeat: -1, repeatDelay: 0.05})

    tl.call(() => {
      this.nextFrame()
      gsap.set(this.material.map.offset, {
        x: this.offsetX,
        y: this.offsetY / (this.tilesY * this.frame),
      })
    })
  }

  nextFrame() {
    const minimumY = (this.currentY - 1) * this.frame
    if (this.offsetY - 1 < minimumY) {
      this.offsetY = this.currentY * this.frame - 1
    } else {
      this.offsetY--
    }
  }
}