import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  TextureLoader,
  Vector2
} from "three";

export default class GameCanvasDrawer {

  constructor(canvas) {
    this.canvas = canvas
    this.vue = canvas.vue
    this.ctx = canvas.ctx
  }

  loadingBackgroundMesh() {
    const texture = new TextureLoader().load(
        process.env.VUE_APP_API_HOST + '/download/bms/stage/'
        + this.vue.bmsCurrent.id)

    const geometry = new PlaneGeometry(14, 14)
    const material = new MeshLambertMaterial({
      map: texture,
      transparent: true
    })

    const mesh = new Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    return mesh
  }

  gearLine(gear) {
    const outLine = gear['outline']
    const color = outLine['color']
    const x = this.ctx.pixelToObj(outLine['x'])
    const y = this.ctx.pixelToObj(outLine['y'])
    const width = this.ctx.pixelToObj(outLine['width'])
    const height = this.ctx.pixelToObj(outLine['height'])

    const mat = new LineBasicMaterial({
      color: color
    })

    const points = []
    points.push(new Vector2(x, y + height))
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    const geo = new BufferGeometry().setFromPoints(points)

    return new Line(geo, mat)
  }

  scratchLine(gear) {
    const scratch = gear['scratch']
    const scratchLine = scratch['line']
    const color = scratchLine['color']
    const x = this.ctx.pixelToObj(scratchLine['x'])
    const y = this.ctx.pixelToObj(scratchLine['y'])
    const height = this.ctx.pixelToObj(scratchLine['height'])

    const mat = new LineBasicMaterial({
      color: color
    })

    const points = []
    points.push(new Vector2(x, y + height))
    points.push(new Vector2(x, y))
    const geo = new BufferGeometry().setFromPoints(points)

    return new Line(geo, mat)
  }

  keyLines(gear, key) {
    const arr = []
    for (let i = 1; i <= key; i++) {
      const k = gear['key' + i]
      const kLine = k['line']
      const color = kLine['color']
      const x = this.ctx.pixelToObj(kLine['x'])
      const y = this.ctx.pixelToObj(kLine['y'])
      const height = this.ctx.pixelToObj(kLine['height'])

      const mat = new LineBasicMaterial({
        color: color
      })

      const points = []
      points.push(new Vector2(x, y + height))
      points.push(new Vector2(x, y))
      const geo = new BufferGeometry().setFromPoints(points)

      const line = new Line(geo, mat)

      arr.push(line)
    }
    return arr
  }

}