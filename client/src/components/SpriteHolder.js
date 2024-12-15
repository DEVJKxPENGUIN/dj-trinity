import {
  LinearFilter,
  NearestFilter,
  RepeatWrapping,
  Sprite,
  SpriteMaterial
} from "three";
import {gsap} from "gsap";

export default class SpriteHolder extends Sprite {

  constructor(texture, tilesX, tilesY, frame, width, height, repeatDelay = 0.05,
      autoAnimate = true, material) {
    const textureClone = texture.clone()

    if (!material) {
      material = new SpriteMaterial({
        map: textureClone,
        transparent: true,
        opacity: 1,
      })
    }

    super(material);
    this.frame = frame
    this.currentY = tilesY
    this.offsetX = 0
    this.offsetY = tilesY * frame - 1
    this.scaleX = width
    this.scaleY = height
    this.scale.x = this.scaleX
    this.scale.y = this.scaleY
    this.tilesX = tilesX
    this.tilesY = tilesY
    this.repeatDelay = repeatDelay

    textureClone.wrapS = RepeatWrapping;
    textureClone.wrapT = RepeatWrapping;
    textureClone.magFilter = NearestFilter;
    textureClone.minFilter = LinearFilter;
    textureClone.needsUpdate = true;

    this.material.map.repeat.set(1 / tilesX, 1 / tilesY / frame)
    this.material.map.offset.x = this.offsetX / tilesX
    this.material.map.offset.y = this.offsetY / (tilesY * frame)

    this.animate(autoAnimate)
  }

  setCurrent(offsetX, offsetY) {
    this.offsetX = offsetX
    this.currentY = offsetY
    this.offsetY = this.currentY * this.frame - 1
    this.material.map.offset.x = this.offsetX / this.tilesX
    this.material.map.offset.y = this.offsetY / (this.tilesY * this.frame)
  }

  setOpacity(opacity) {
    this.material.opacity = opacity
  }

  animate(repeat) {
    if (this.tl) {
      this.tl.kill()
      return
    }

    this.tl = gsap.timeline({
      repeat: repeat ? -1 : this.frame,
      repeatDelay: this.repeatDelay,
    })

    this.tl.call(() => {
      this.nextFrame()
      gsap.set(this.material.map.offset, {
        x: this.offsetX / this.tilesX,
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