import {Color, Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import settings from "../options/canvas/settings.json";
import store from "@/store/store"

export default class AppManager {

  constructor() {
    this.init()
  }

  init() {
    this.scene = new Scene()
    this.scene.background = new Color(settings.common.background.color)
    this.camera = new PerspectiveCamera(45,
        window.innerWidth / window.innerHeight, 0.1, 500)
    this.camera.position.z = 10

    this.renderer = new WebGLRenderer({})
    this.renderer.setPixelRatio(window.devicePixelRatio) // 고해상도 디스플레이 대응
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.insertBefore(this.renderer.domElement,
        document.body.firstChild)

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    this.draw = this.draw.bind(this)
    this.draw()
  }

  async initScene(canvas, socket, worker) {
    this.canvas = canvas
    if (this.canvas) {
      await this.canvas.init(this)
    }

    this.socket = socket
    if (this.socket) {
      await this.socket.init(this)
    }

    // worker do not init
    this.worker = worker
  }

  async removeScene() {
    if (!this.canvas) {
      return Promise.resolve()
    }

    await store.dispatch('showSceneChange')
    return new Promise(resolve => {
      // canvas 이외에 js 관련 세팅한 것이 있다면 해제한다.
      if (this.canvas) {
        this.canvas.destroy()
        this.disposeAll()
        this.canvas = null
      }

      if (this.socket) {
        this.socket.destroy()
        this.socket = null
      }

      if (this.worker) {
        this.worker.terminate()
        this.worker = null
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

  disposeTraversal(node) {
    if (!node) {
      return
    }

    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      this.disposeTraversal(child);
      this.disposeSingle(child)
    }
  }

  disposeSingle(node) {
    if (node instanceof Mesh) {
      if (node.geometry) {
        node.geometry.dispose();
      }
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach(material => material.dispose());
        } else {
          node.material.dispose();
        }
        if (node.material.map) {
          node.material.map.dispose();
        } // 텍스처 해제
      }
    }
  }

  objToPixel(sizeOfObject) {
    const vFov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * this.camera.position.z;
    const aspect = window.innerWidth / window.innerHeight;
    const width = height * aspect;
    return window.innerWidth * ((1 / width) * sizeOfObject) // (e.g. sizeOfObject = 0.2)
  }

  pixelToObj(sizeOfPixel) {
    const vFov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * this.camera.position.z;
    const aspect = window.innerWidth / window.innerHeight;
    const width = height * aspect;
    return sizeOfPixel * (width / window.innerWidth);
  }

  draw() {
    this.renderer.render(this.scene, this.camera)
    if (this.canvas && this.canvas.update) {
      this.canvas.update()
    }
    requestAnimationFrame(this.draw)
  }

}