import {Box3, Group, Vector3} from "three";
import SpriteHolder from "@/components/SpriteHolder";

export default class ComboSprite extends Group {

  constructor(texture, tilesX, tilesY, frame, width, height) {
    super()
    this.widthPerDigit = width
    this.heightPerDigit = height
    this.numberSprites = []
    for (let i = 0; i < 5; i++) {
      this.numberSprites[i] = new SpriteHolder(texture, tilesX, tilesY, frame,
          this.widthPerDigit, this.heightPerDigit)
    }

    this.setNumber(0)
  }

  setNumber(number) {
    if(number === 0) {
      this.setOpacity(0)
    } else {
      this.setOpacity(0.8)
    }

    const digits = String(number).split('').map(Number)

    this.clear()
    digits.forEach((digit, i) => {
      this.numberSprites[i].position.x = i * this.widthPerDigit
      if (digit === 0) {
        digit = 10
      }
      this.numberSprites[i].setCurrent(digit - 1, 1)
      this.add(this.numberSprites[i])
    })

    const box = new Box3().setFromObject(this);
    const center = box.getCenter(new Vector3());
    this.position.x -= center.x;

    this.scaleX = digits.length * this.widthPerDigit
    this.scaleY = this.heightPerDigit
  }

  setOpacity(opacity) {
    this.children.forEach((sprite) => {
      sprite.setOpacity(opacity)
    })
  }
}