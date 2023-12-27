import {Color, OrthographicCamera, Scene, WebGLRenderer} from "three";
import settings from "./settings/settings.json";
import Stats from "three/addons/libs/stats.module";
import {CSS3DRenderer} from "three/addons";

export default class Context {
  constructor(isDebug) {
    this.isDebug = isDebug
    this.scene = new Scene()
    this.scene.background = new Color(0x111111)

    this.renderer = new WebGLRenderer()
    this.renderer.setSize(settings.width, settings.height)
    document.body.appendChild(this.renderer.domElement)

    this.cssRenderer = new CSS3DRenderer()
    this.cssRenderer.setSize(settings.width, settings.height)
    this.cssRenderer.domElement.style.position = 'absolute'
    document.body.appendChild(this.cssRenderer.domElement)

    this.aspect = settings.width / settings.height
    this.camera = new OrthographicCamera(
        settings.frustumSize * this.aspect / -2,
        settings.frustumSize * this.aspect / 2,
        settings.frustumSize / 2,
        settings.frustumSize / -2,
    )
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(0, 0, 0)

    if (this.isDebug) {
      // const cameraHelper = new CameraHelper(this.camera)
      // this.scene.add(cameraHelper)
      // const gridHelper = new GridHelper(1)
      // this.scene.add(gridHelper)
      // const axesHelper = new AxesHelper()
      // this.scene.add(axesHelper)
      this.stats = new Stats()
      document.body.append(this.stats.domElement)
    }

    this.resize()
    window.addEventListener('resize', this.resize, false)
  }

  resize = () => {
    const targetRatio = settings.width / settings.height
    const windowRatio = window.innerWidth / window.innerHeight
    if (windowRatio < targetRatio) {
      this.renderer.domElement.style.width = '100vw'
      this.renderer.domElement.style.height = `calc(100vw / ${targetRatio})`
    } else {
      this.renderer.domElement.style.height = '100vh'
      this.renderer.domElement.style.width = `calc(100vh * ${targetRatio})`
    }
  }

  draw = () => {
    this.renderer.render(this.scene, this.camera)
    this.cssRenderer.render(this.scene, this.camera)
    if (this.isDebug) {
      this.stats.update()
    }
  }

  removeObject = (object) => {
    this.scene.remove(object);

    if (object.geometry) {
      object.geometry.dispose();
    }

    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose());
      } else {
        object.material.dispose();
      }
    }

    if (object.material && object.material.map) {
      object.material.map.dispose();
    }
  }
}