import {
  AudioListener,
  Color,
  Group,
  OrthographicCamera,
  Scene,
  WebGLRenderer
} from "three";
import settings from "./settings/settings.json";
import Stats from "three/addons/libs/stats.module";
import {CSS3DRenderer} from "three/addons";
import * as TWEEN from "@tweenjs/tween.js";
import commonResources from "./common/commonResources.json";
import ResourceLoader from "./common/resourceLoader";
import BackgroundSoundHandler from "./common/backgroundSoundHandler";

export default class Context {
  constructor(isDebug, sceneManager) {
    this.isDebug = isDebug
    this.sceneManager = sceneManager

    this.scene = new Scene()
    this.scene.background = new Color(0x111111)

    this.renderer = new WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    })
    this.renderer.setSize(settings.width, settings.height)
    document.body.appendChild(this.renderer.domElement)

    this.cssRenderer = new CSS3DRenderer()
    this.cssRenderer.setSize(settings.width, settings.height)
    this.cssRenderer.domElement.style.position = 'fixed'
    document.body.appendChild(this.cssRenderer.domElement)

    this.listener = new AudioListener()
    this.backgroundSound = new BackgroundSoundHandler(this)

    this.aspect = settings.width / settings.height
    this.camera = new OrthographicCamera(
        settings.frustumSize * this.aspect / -2,
        settings.frustumSize * this.aspect / 2,
        settings.frustumSize / 2,
        settings.frustumSize / -2,
    )
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(0, 0, 0)
    this.camera.add(this.listener)

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

  init = async () => {
    this.commonResources = commonResources
    const loader = new ResourceLoader(this)
    await loader.load(this.commonResources)

    this.info = this.defaultInfo()
    await this.sceneManager.init(this)
  }

  defaultInfo = () => {
    return {
      user: {
        id: "undefined",
        nickname: "undefined",
        profile: "image/trinity.webp",
      },
      channel: {
        id: "connecting",
        users: [
          // {id: "user1", nickname: "sdfjkl", profile: "image/trinity.webp"},
          // {id: "user2", nickname: "jkzlxcjvkl", profile: "image/trinity.webp"},
          // {id: "devjk", nickname: "jfksj", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
          // {id: "user4", nickname: "djkflzjx", profile: "image/trinity.webp"},
        ],
      },
    }
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

  draw = (caller) => {
    this.renderer.render(this.scene, this.camera)
    this.cssRenderer.render(this.scene, this.camera)
    TWEEN.update()
    if (this.isDebug) {
      this.stats.update()
    }
  }

  changeScene = (newScene) => {
    // 현재 씬 메모리 해제
    this.disposeAll()

    // 현재 씬 컨트롤러 해제
    this.sceneManager.destroy()

    // 씬 컨트롤러 체인지
    this.sceneManager = newScene
    this.sceneManager.init(this)
  }

  disposeAll = () => {
    this.scene.traverse(obj => {
      this.removeObject(obj)
    })

    const resources = this.sceneManager.resources
    if (resources.textures) {
      Object.keys(resources.textures).forEach(texture => {
        texture.dispose()
      })
    }
    // fixme - do not dispose commonResources
    // const commonResources = this.commonResources
    // if (commonResources.textures) {
    //   Object.keys(commonResources.textures).forEach(texture => {
    //     texture.dispose()
    //   })
    // }

    this.draw()
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

  // group 하위의 오브젝트 모두 제거
  removeGroup = (group) => {
    while (group.children.length > 0) {
      const object = group.children[0];

      // 재질 해제
      if (object.material) {
        object.material.dispose();
      }

      // 지오메트리 해제
      if (object.geometry) {
        object.geometry.dispose();
      }

      // 하위 오브젝트가 Group인 경우 재귀적으로 처리
      if (object instanceof Group) {
        this.removeGroup(object);
      }

      // 오브젝트를 Group에서 제거
      group.remove(object);
    }
  }
}