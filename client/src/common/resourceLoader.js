import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  LoadingManager,
  Vector3
} from "three";
import {FontLoader} from "three/addons";
import settings from "../settings/settings.json"

export default class ResourceLoader {
  constructor(ctx) {
    this.context = ctx
    this.manager = new LoadingManager()
    this.loadPromiseResolve = null
    this.loadPromiseReject = null
    this.loadFinished = null
    this.loadLine = null

    this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log('Started loading file');
    };

    this.manager.onLoad = () => {
      this.loadFinished = true
      this.context.removeObject(this.loadLine)
      this.loadPromiseResolve()
    };

    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      console.log('Loading progress: ' + progress * 100 + '%');
      this.loadLine.geometry.setFromPoints([
        new Vector3(settings.frustumSize * this.context.aspect / -2,
            settings.frustumSize / 2 - 5, 0),
        new Vector3(settings.frustumSize * this.context.aspect * progress
            - settings.frustumSize * this.context.aspect / -2,
            settings.frustumSize / 2 - 5, 0)
      ])
    };

    this.manager.onError = (url) => {
      this.loadPromiseReject()
    };
  }

  load = async (resources) => {
    return new Promise((resolve, reject) => {
      this.loadPromiseResolve = resolve
      this.loadPromiseReject = reject

      this.loadLine = new Line(new BufferGeometry(), new LineBasicMaterial({
        color: 0x8c8c8c,
        linewidth: 5
      }));
      this.context.scene.add(this.loadLine)

      const fontLoader = new FontLoader(this.manager);
      Object.keys(resources.fonts).forEach(fontPath => {
        console.log('resource : ', fontPath)
        fontLoader.load(fontPath, function (font) {
          resources.fonts[fontPath] = font
        });
      })

      // todo other resources

      this.animate()
    })
  }

  animate = () => {
    if (this.loadFinished) {
      return
    }
    requestAnimationFrame(this.animate);
    this.context.draw()
  }

}