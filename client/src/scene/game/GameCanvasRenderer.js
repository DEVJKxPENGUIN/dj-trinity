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
import {Text} from "troika-three-text"

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

  vgaBackgroundMesh(video) {
    const texture = new VideoTexture(video)
    const geometry = new PlaneGeometry(14, 14)
    const material = new MeshBasicMaterial({
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
      color: color,
      transparent: true
    })

    const points = []
    points.push(new Vector2(x, y + height))
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    const geo = new BufferGeometry().setFromPoints(points)

    const line = new Line(geo, mat)
    return line
  }

  backboard(gear) {
    const backboard = gear['backboard']
    const opacity = backboard['opacity']
    const color = backboard['color']
    const x = this.ctx.pixelToObj(backboard['x'])
    const y = this.ctx.pixelToObj(backboard['y'])
    const width = this.ctx.pixelToObj(backboard['width'])
    const height = this.ctx.pixelToObj(backboard['height'])

    const mat = new MeshBasicMaterial({
      color: color,
      opacity: opacity,
      transparent: true
    })

    const points = []
    points.push(new Vector2(x, y + height))
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    const geo = new BufferGeometry().setFromPoints(points)
    geo.setIndex([0, 1, 2, 0, 2, 3])

    const mesh = new Mesh(geo, mat)
    return mesh
  }

  scratchLine(gear) {
    const scratch = gear['scratch']
    const scratchLine = scratch['line']
    const color = scratchLine['color']
    const x = this.ctx.pixelToObj(scratchLine['x'])
    const y = this.ctx.pixelToObj(scratchLine['y'])
    const height = this.ctx.pixelToObj(scratchLine['height'])

    const mat = new LineBasicMaterial({
      color: color,
      transparent: true
    })

    const points = []
    points.push(new Vector2(x, y + height))
    points.push(new Vector2(x, y))
    const geo = new BufferGeometry().setFromPoints(points)

    const line = new Line(geo, mat)
    return line
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
        color: color,
        transparent: true
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
      color: color,
      transparent: true
    })

    const points = []
    points.push(new Vector2(x, y - height / 2))
    points.push(new Vector2(x + width, y - height / 2))
    points.push(new Vector2(x + width, y + height / 2))
    points.push(new Vector2(x, y + height / 2))
    points.push(new Vector2(x, y - height / 2))
    const geo = new BufferGeometry().setFromPoints(points)

    const line = new Line(geo, mat)
    return line
  }

  bar(gear) {
    const bar = gear['bar']
    const color = bar['color']
    const linewidth = bar['linewidth']
    const x = this.ctx.pixelToObj(bar['x'])
    const width = this.ctx.pixelToObj(bar['width'])

    const mat = new LineBasicMaterial({
      color: color,
      linewidth: linewidth,
      transparent: true
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
      color: color,
      transparent: true
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

  pressEffect(gear, keyIndex) {
    const k = gear['key' + keyIndex]
    const kPressEffect = k['pressEffect']
    const x = this.ctx.pixelToObj(kPressEffect['x'])
    const y = this.ctx.pixelToObj(kPressEffect['y'])
    const width = this.ctx.pixelToObj(kPressEffect['width'])
    const height = this.ctx.pixelToObj(kPressEffect['height'])

    const mat = new MeshBasicMaterial({
      color: 'rgb(255, 255, 255)',
      opacity: 0.05,
      transparent: true
    })

    const points = []
    points.push(new Vector2(x, y + height))
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    const geo = new BufferGeometry().setFromPoints(points)
    geo.setIndex([0, 1, 2, 0, 2, 3])

    return new Mesh(geo, mat)
  }

  scratchEffect(gear) {
    const k = gear['scratch']
    const kScratchEffect = k['pressEffect']
    const x = this.ctx.pixelToObj(kScratchEffect['x'])
    const y = this.ctx.pixelToObj(kScratchEffect['y'])
    const width = this.ctx.pixelToObj(kScratchEffect['width'])
    const height = this.ctx.pixelToObj(kScratchEffect['height'])

    const mat = new MeshBasicMaterial({
      color: 'rgb(255, 255, 255)',
      opacity: 0.05,
      transparent: true
    })

    const points = []
    points.push(new Vector2(x, y + height))
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    const geo = new BufferGeometry().setFromPoints(points)
    geo.setIndex([0, 1, 2, 0, 2, 3])

    return new Mesh(geo, mat)
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
      color: color,
      transparent: true
    })
    const points = []
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    points.push(new Vector2(x, y + height))
    const geo = new BufferGeometry().setFromPoints(points)
    return new Line(geo, mat)
  }

  bpmBox(ui) {
    const bpm = ui['bpm']
    const bpmBox = bpm['box']
    const color = bpmBox['color']
    const x = this.ctx.pixelToObj(bpmBox['x'])
    const y = this.ctx.pixelToObj(bpmBox['y'])
    const width = this.ctx.pixelToObj(bpmBox['width'])
    const height = this.ctx.pixelToObj(bpmBox['height'])
    const mat = new LineBasicMaterial({
      color: color,
      transparent: true
    })
    const points = []
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    points.push(new Vector2(x, y + height))
    const geo = new BufferGeometry().setFromPoints(points)
    return new Line(geo, mat)
  }

  timeBackboard(ui) {
    const time = ui['time']
    const timeBox = time['box']
    const x = this.ctx.pixelToObj(timeBox['x'])
    const y = this.ctx.pixelToObj(timeBox['y'])
    const width = this.ctx.pixelToObj(timeBox['width'])
    const height = this.ctx.pixelToObj(timeBox['height'])
    const backgroundColor = timeBox['backgroundColor']
    const opacity = timeBox['opacity']
    const mat = new MeshBasicMaterial({
      color: backgroundColor,
      opacity: opacity,
      transparent: true
    })
    const points = []
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    points.push(new Vector2(x, y + height))
    const geo = new BufferGeometry().setFromPoints(points)
    geo.setIndex([0, 1, 2, 0, 2, 3])
    return new Mesh(geo, mat)
  }

  bpmBackboard(ui) {
    const bpm = ui['bpm']
    const bpmBox = bpm['box']
    const x = this.ctx.pixelToObj(bpmBox['x'])
    const y = this.ctx.pixelToObj(bpmBox['y'])
    const width = this.ctx.pixelToObj(bpmBox['width'])
    const height = this.ctx.pixelToObj(bpmBox['height'])
    const backgroundColor = bpmBox['backgroundColor']
    const opacity = bpmBox['opacity']
    const mat = new MeshBasicMaterial({
      color: backgroundColor,
      opacity: opacity,
      transparent: true
    })
    const points = []
    points.push(new Vector2(x, y))
    points.push(new Vector2(x + width, y))
    points.push(new Vector2(x + width, y + height))
    points.push(new Vector2(x, y + height))
    const geo = new BufferGeometry().setFromPoints(points)
    geo.setIndex([0, 1, 2, 0, 2, 3])
    return new Mesh(geo, mat)
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

    const textMesh = new Text()
    textMesh.text = text
    textMesh.fontSize = size
    textMesh.font = font
    textMesh.position.x = x
    textMesh.position.y = y
    textMesh.color = color
    textMesh.sync()
    return textMesh
  }

  bpm(ui, text) {
    const bpm = ui['bpm']
    const bpmText = bpm['text']
    const color = bpmText['color']
    const fontKey = bpmText['font']
    const size = bpmText['size']
    const isCenter = bpmText['isCenter']
    const font = this.vue.fonts.get(fontKey)
    const x = this.ctx.pixelToObj(bpmText['x'])
    const y = this.ctx.pixelToObj(bpmText['y'])

    const textMesh = new Text()
    textMesh.text = text
    // textMesh.fontFamily = font
    textMesh.fontSize = size
    textMesh.font = font
    textMesh.position.x = x
    textMesh.position.y = y
    textMesh.color = color
    textMesh.sync()
    return textMesh
  }
}