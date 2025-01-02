import {
  BufferGeometry,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  TextureLoader,
  Vector2,
  Vector3,
  VideoTexture
} from "three";
import {Text} from "troika-three-text"
import SpriteHolder from "@/components/SpriteHolder";
import ComboSprite from "@/components/ComboSprite";

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

  blockTextures(gear, key) {
    // make texture set
    const block = key === 0 ? gear['scratch']['block'] : gear['key'
    + key]['block']
    return this.vue.textures.get(block['spriteName'])
  }

  blockPosition(gear, key) {
    const block = key === 0 ? gear['scratch']['block'] : gear['key'
    + key]['block']
    const x = this.ctx.pixelToObj(block['x'])
    const y = this.ctx.pixelToObj(block['y'])
    return {x: x, y: 10, z: 0}
  }

  blockSprite(gear, key, positions) {
    const block = key === 0 ? gear['scratch']['block'] : gear['key'
    + key]['block']
    const x = this.ctx.pixelToObj(block['x'])
    const width = this.ctx.pixelToObj(block['width'])
    const height = this.ctx.pixelToObj(block['height'])

    const geo = new PlaneGeometry(width, height)
    const mat = new MeshBasicMaterial({
      map: this.blockTextures(gear, key),
      transparent: true
    })

    const instancedSprites = new InstancedMesh(geo, mat, positions.length)

    const dummyMatrix = new Matrix4()
    const dummyPosition = new Vector3()
    for (let i = 0; i < positions.length; i++) {
      dummyPosition.set(positions[i].x, positions[i].y, positions[i].z)
      dummyMatrix.setPosition(dummyPosition)
      instancedSprites.setMatrixAt(i, dummyMatrix)
    }

    instancedSprites.frustumCulled = false
    instancedSprites.instanceMatrix.needsUpdate = true
    return instancedSprites
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

  judgeEffect(gear) {
    const k = gear['judgeEffect']
    const x = this.ctx.pixelToObj(k['x'])
    const y = this.ctx.pixelToObj(k['y'])
    const width = this.ctx.pixelToObj(k['width'])
    const height = this.ctx.pixelToObj(k['height'])

    const judgeMap = this.vue.textures.get('judgeEffect')
    const sprite = new SpriteHolder(judgeMap, 2, 3, 5, width, height)
    sprite.position.x = x
    sprite.position.y = y

    return sprite
  }

  comboEffect(gear) {
    const k = gear['comboEffect']
    const x = this.ctx.pixelToObj(k['x'])
    const y = this.ctx.pixelToObj(k['y'])
    const width = this.ctx.pixelToObj(k['width'])
    const height = this.ctx.pixelToObj(k['height'])

    const judgeMap = this.vue.textures.get('comboNumber')
    const sprite = new ComboSprite(judgeMap, 10, 1, 1, width, height)
    sprite.position.x = x
    sprite.position.y = y

    return sprite
  }

  hitEffect(gear, keyIndex) {
    const k = keyIndex === 0 ? gear['scratch'] : gear['key' + keyIndex]
    const khitEffect = k['hitEffect']
    const x = this.ctx.pixelToObj(khitEffect['x'])
    const y = this.ctx.pixelToObj(khitEffect['y'])
    const width = this.ctx.pixelToObj(khitEffect['width'])
    const height = this.ctx.pixelToObj(khitEffect['height'])

    const hitMap = this.vue.textures.get('hitEffect')
    const sprite = new SpriteHolder(hitMap, 1, 1, 16, width, height, 0.02)
    sprite.position.x = x
    sprite.position.y = y

    return sprite
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

  scoreBackboard(ui) {
    const score = ui['score']
    const scoreBox = score['box']
    const x = this.ctx.pixelToObj(scoreBox['x'])
    const y = this.ctx.pixelToObj(scoreBox['y'])
    const width = this.ctx.pixelToObj(scoreBox['width'])
    const height = this.ctx.pixelToObj(scoreBox['height'])
    const backgroundColor = scoreBox['backgroundColor']
    const opacity = scoreBox['opacity']
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

  coolBackboard(ui) {
    const cool = ui['cool']
    const coolBox = cool['box']
    const x = this.ctx.pixelToObj(coolBox['x'])
    const y = this.ctx.pixelToObj(coolBox['y'])
    const width = this.ctx.pixelToObj(coolBox['width'])
    const height = this.ctx.pixelToObj(coolBox['height'])
    const backgroundColor = coolBox['backgroundColor']
    const opacity = coolBox['opacity']
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

  greatBackboard(ui) {
    const great = ui['great']
    const greatBox = great['box']
    const x = this.ctx.pixelToObj(greatBox['x'])
    const y = this.ctx.pixelToObj(greatBox['y'])
    const width = this.ctx.pixelToObj(greatBox['width'])
    const height = this.ctx.pixelToObj(greatBox['height'])
    const backgroundColor = greatBox['backgroundColor']
    const opacity = greatBox['opacity']
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

  goodBackboard(ui) {
    const good = ui['good']
    const goodBox = good['box']
    const x = this.ctx.pixelToObj(goodBox['x'])
    const y = this.ctx.pixelToObj(goodBox['y'])
    const width = this.ctx.pixelToObj(goodBox['width'])
    const height = this.ctx.pixelToObj(goodBox['height'])
    const backgroundColor = goodBox['backgroundColor']
    const opacity = goodBox['opacity']
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

  badBackboard(ui) {
    const bad = ui['bad']
    const badBox = bad['box']
    const x = this.ctx.pixelToObj(badBox['x'])
    const y = this.ctx.pixelToObj(badBox['y'])
    const width = this.ctx.pixelToObj(badBox['width'])
    const height = this.ctx.pixelToObj(badBox['height'])
    const backgroundColor = badBox['backgroundColor']
    const opacity = badBox['opacity']
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

  missBackboard(ui) {
    const miss = ui['miss']
    const missBox = miss['box']
    const x = this.ctx.pixelToObj(missBox['x'])
    const y = this.ctx.pixelToObj(missBox['y'])
    const width = this.ctx.pixelToObj(missBox['width'])
    const height = this.ctx.pixelToObj(missBox['height'])
    const backgroundColor = missBox['backgroundColor']
    const opacity = missBox['opacity']
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

  score(ui, text) {
    const score = ui['score']
    const scoreText = score['text']
    const color = scoreText['color']
    const fontKey = scoreText['font']
    const size = scoreText['size']
    const isCenter = scoreText['isCenter']
    const font = this.vue.fonts.get(fontKey)
    const x = this.ctx.pixelToObj(scoreText['x'])
    const y = this.ctx.pixelToObj(scoreText['y'])

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

  cool(ui, text) {
    const cool = ui['cool']
    const coolText = cool['text']
    const color = coolText['color']
    const fontKey = coolText['font']
    const size = coolText['size']
    const isCenter = coolText['isCenter']
    const font = this.vue.fonts.get(fontKey)
    const x = this.ctx.pixelToObj(coolText['x'])
    const y = this.ctx.pixelToObj(coolText['y'])

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

  great(ui, text) {
    const great = ui['great']
    const greatText = great['text']
    const color = greatText['color']
    const fontKey = greatText['font']
    const size = greatText['size']
    const isCenter = greatText['isCenter']
    const font = this.vue.fonts.get(fontKey)
    const x = this.ctx.pixelToObj(greatText['x'])
    const y = this.ctx.pixelToObj(greatText['y'])

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

  good(ui, text) {
    const good = ui['good']
    const goodText = good['text']
    const color = goodText['color']
    const fontKey = goodText['font']
    const size = goodText['size']
    const isCenter = goodText['isCenter']
    const font = this.vue.fonts.get(fontKey)
    const x = this.ctx.pixelToObj(goodText['x'])
    const y = this.ctx.pixelToObj(goodText['y'])

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

  bad(ui, text) {
    const bad = ui['bad']
    const badText = bad['text']
    const color = badText['color']
    const fontKey = badText['font']
    const size = badText['size']
    const isCenter = badText['isCenter']
    const font = this.vue.fonts.get(fontKey)
    const x = this.ctx.pixelToObj(badText['x'])
    const y = this.ctx.pixelToObj(badText['y'])

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

  miss(ui, text) {
    const miss = ui['miss']
    const missText = miss['text']
    const color = missText['color']
    const fontKey = missText['font']
    const size = missText['size']
    const isCenter = missText['isCenter']
    const font = this.vue.fonts.get(fontKey)
    const x = this.ctx.pixelToObj(missText['x'])
    const y = this.ctx.pixelToObj(missText['y'])

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