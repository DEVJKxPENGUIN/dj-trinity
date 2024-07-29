import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  TextureLoader,
  Vector2,
  VideoTexture
} from "three";
import {TextGeometry} from "three/addons";

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

  vgaBackgroundMesh() {
    const texture = new VideoTexture(this.vue.vga.video)
    const geometry = new PlaneGeometry(14, 14)
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true
    })

    const mesh = new Mesh(geometry, material)
    mesh.position.set(0, 0, -1)
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

  judgeLine(gear) {
    const judgeLine = gear['judgeLine']
    const color = judgeLine['color']
    const x = this.ctx.pixelToObj(judgeLine['x'])
    const y = this.ctx.pixelToObj(judgeLine['y'])
    const width = this.ctx.pixelToObj(judgeLine['width'])
    const height = this.ctx.pixelToObj(judgeLine['height'])

    const mat = new LineBasicMaterial({
      color: color
    })

    const points = []
    points.push(new Vector2(x, y - height / 2))
    points.push(new Vector2(x + width, y - height / 2))
    points.push(new Vector2(x + width, y + height / 2))
    points.push(new Vector2(x, y + height / 2))
    points.push(new Vector2(x, y - height / 2))
    const geo = new BufferGeometry().setFromPoints(points)

    return new Line(geo, mat)
  }

  bar(gear) {
    const bar = gear['bar']
    const color = bar['color']
    const linewidth = bar['linewidth']
    const x = this.ctx.pixelToObj(bar['x'])
    const width = this.ctx.pixelToObj(bar['width'])

    const mat = new LineBasicMaterial({
      color: color,
      linewidth: linewidth
    })

    const points = []
    points.push(new Vector2(x, 0))
    points.push(new Vector2(x + width, 0))
    const geo = new BufferGeometry().setFromPoints(points)

    const line = new Line(geo, mat)
    const obj = new Object3D()
    obj.add(line)
    obj.position.y = 100
    return obj
  }

  block(gear, key) {
    const block = key === 0 ? gear['scratch']['block'] : gear['key'
    + key]['block']
    const color = block['color']
    const x = this.ctx.pixelToObj(block['x'])
    const width = this.ctx.pixelToObj(block['width'])
    const height = this.ctx.pixelToObj(block['height'])

    const mat = new LineBasicMaterial({
      color: color
    })

    const points = []
    points.push(new Vector2(x, 0))
    points.push(new Vector2(x + width, 0))
    points.push(new Vector2(x + width, height))
    points.push(new Vector2(x, height))
    points.push(new Vector2(x, 0))
    const geo = new BufferGeometry().setFromPoints(points)

    const line = new Line(geo, mat)
    const obj = new Object3D()
    obj.add(line)
    obj.position.y = 100
    return obj
  }

  timeBox(ui) {
    const time = ui['time']
    const timeBox = time['box']
    const color = timeBox['color']
    const x = this.ctx.pixelToObj(timeBox['x'])
    const y = this.ctx.pixelToObj(timeBox['y'])
    const width = this.ctx.pixelToObj(timeBox['width'])
    const height = this.ctx.pixelToObj(timeBox['height'])

    const mat = new LineBasicMaterial({
      color: color
    })

    const points = []
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    points.push(new Vector2(x, y + height))
    const geo = new BufferGeometry().setFromPoints(points)

    return new Line(geo, mat)
  }

  elapsedTime(ui, text) {
    const time = ui['time']
    const timeText = time['text']
    const color = timeText['color']
    const fontKey = timeText['font']
    const size = timeText['size']
    const isCenter = timeText['isCenter']
    const font = this.vue.fonts.get(fontKey)
    const x = this.ctx.pixelToObj(timeText['x'])
    const y = this.ctx.pixelToObj(timeText['y'])

    const geo = new TextGeometry(text, {
      font: font,
      size: size,
      height: 0,
      curveSegments: 12,
      bevelEnabled: false
    })
    const mat = new MeshBasicMaterial({color: color});
    const mesh = new Mesh(geo, mat)
    mesh.position.x = x
    mesh.position.y = y
    return mesh
  }

  updateText(mesh, text) {
    const geo = mesh.geometry
    const newGeo = new TextGeometry(text, {
      font: geo.parameters.options.font,
      size: geo.parameters.options.size,
      height: geo.parameters.options.height,
      curveSegments: geo.parameters.options.curveSegments,
      bevelEnabled: geo.parameters.options.bevelEnabled,
      bevelThickness: geo.parameters.options.bevelThickness,
      bevelSize: geo.parameters.options.bevelSize,
      bevelOffset: geo.parameters.options.bevelOffset,
      bevelSegments: geo.parameters.options.bevelSegments
    })

    mesh.geometry.dispose()
    mesh.geometry = newGeo
  }
}