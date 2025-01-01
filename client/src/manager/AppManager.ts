import {Color, Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import settings from "../options/canvas/settings.json";
import store from "@/store/store"
import Stats from "stats.js"
import Canvas from "@/scene/common/Canvas";
import Socket from "@/scene/common/Socket";

export default class AppManager {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  stats: Stats
  canvas: Canvas | undefined
  socket: Socket | undefined

  constructor() {
    this.init()
  }

  init() {
    this.scene = new Scene()
    this.scene.background = new Color(settings.common.background.color)
    this.camera = new PerspectiveCamera(45,
        window.innerWidth / window.innerHeight, 0.1, 500)
    this.camera.position.z = 10

    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance"
    })
    this.renderer.setPixelRatio(window.devicePixelRatio) // 고해상도 디스플레이 대응
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.insertBefore(this.renderer.domElement,
        document.body.firstChild)

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    // for debug
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    this.draw = this.draw.bind(this)
    this.draw()
  }

  async initScene(canvas: Canvas, socket: Socket | undefined) {
    this.canvas = canvas
    if (this.canvas) {
      await this.canvas.init(this)
    }

    this.socket = socket
    if (this.socket) {
      await this.socket.init(this)
    }
  }

  async removeScene() {
    if (!this.canvas) {
      return Promise.resolve()
    }

    await store.dispatch('showSceneChange')
    return new Promise<void>(resolve => {
      // canvas 이외에 js 관련 세팅한 것이 있다면 해제한다.
      if (this.canvas) {
        this.canvas.destroy()
        this.disposeAll()
        this.canvas = undefined
      }

      if (this.socket) {
        this.socket.destroy()
        this.socket = undefined
      }

      resolve()
    })
  }

  disposeAll() {
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0];
      this.disposeTraversal(object);
      this.scene.remove(object);
    }
  }

  disposeTraversal(node: any) {
    if (!node) {
      return
    }

    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      this.disposeTraversal(child);
      this.disposeSingle(child)
    }
  }

  disposeSingle(node: any) {
    if (node instanceof Mesh) {
      if (node.geometry) {
        node.geometry.dispose();
      }
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((material: { dispose: () => any; }) => material.dispose());
        } else {
          node.material.dispose();
        }
        if (node.material.map) {
          node.material.map.dispose();
        } // 텍스처 해제
      }
    }
  }

  objToPixel(sizeOfObject: number) {
    const vFov = (this.camera.fov * Math.PI) * 0.005555; // / 180 연산임
    const height = 2 * Math.tan(vFov * 0.5) * this.camera.position.z;
    const aspect = window.innerWidth / window.innerHeight;
    const width = height * aspect;
    return window.innerWidth * ((1 / width) * sizeOfObject) // (e.g. sizeOfObject = 0.2)
  }

  pixelToObj(sizeOfPixel: number) {
    const vFov = (this.camera.fov * Math.PI) * 0.005555; // / 180 연산임
    const height = 2 * Math.tan(vFov * 0.5) * this.camera.position.z;
    const aspect = window.innerWidth / window.innerHeight;
    const width = height * aspect;
    return sizeOfPixel * (width / window.innerWidth);
  }

  draw() {
    this.stats.begin()
    this.renderer.render(this.scene, this.camera)
    if (this.canvas && this.canvas.update) {
      this.canvas.update()
    }
    this.stats.end()
    requestAnimationFrame(this.draw)
  }

}