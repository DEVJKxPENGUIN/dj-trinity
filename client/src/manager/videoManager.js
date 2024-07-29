import {toBlobURL} from "@ffmpeg/util";
import {FFmpeg} from "@ffmpeg/ffmpeg";

const apiHost = process.env.VUE_APP_API_HOST

export default class VideoManager {
  STOPPED = 0
  PLAYING = 1
  PAUSED = 2

  constructor() {
    this.videoMap = new Map()
    this.state = this.STOPPED
    this.currentIndex = null
    this.ffmpeg = null
  }

  async load(index, uri) {
    const response = await fetch(`${apiHost}${uri}`)
    if (!response.ok) {
      throw new Error('Network response was not ok.')
    }
    const ext = response.headers.get('Content-Disposition').split('.')[1]

    let blob
    if (this.isUnsupportedVideoFormat(ext)) {
      await this.loadFFmpeg()
      blob = await this.convertMp4(response, ext)
    } else {
      blob = await response.blob()
    }

    const videoUrl = URL.createObjectURL(blob)
    const video = document.createElement('video')
    video.src = videoUrl
    video.load()
    this.videoMap.set(index, video)
  }

  isUnsupportedVideoFormat(ext) {
    // todo -> 다양한 동영상 타입에 맞춰서 추가될 것.
    return ext === 'mpeg' || ext === 'mpg' || ext === 'wmv'
  }

  async loadFFmpeg() {
    if (this.ffmpeg) {
      return
    }

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    this.ffmpeg = new FFmpeg()
    this.ffmpeg.on('log', ({message}) => {
      console.log(message);
    })

    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`,
          'application/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`,
          'application/wasm'),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`,
          'application/javascript')
    })
  }

  async convertMp4(response, ext) {
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    await this.ffmpeg.writeFile(`input.${ext}`, uint8Array)

    await this.ffmpeg.exec([
      '-i', `input.${ext}`,
      '-preset', 'ultrafast',
      '-threads', '0',
      'output.mp4'
    ]);

    const output = await this.ffmpeg.readFile('output.mp4')
    return new Blob([output.buffer], {type: 'video/mp4'})
  }

  play(index) {
    if (this.state === this.STOPPED) {
      this.state = this.PLAYING
      this.currentIndex = index
      this.videoMap.get(index).play()
    }
  }

  pause(index) {
    if (this.state === this.PLAYING) {
      this.state = this.PAUSED
      if (index === undefined) {
        index = this.currentIndex
      }
      this.videoMap.get(index).pause()
    }
  }

  resume(index) {
    if (this.state === this.PAUSED) {
      this.state = this.PLAYING
      if (index === undefined) {
        index = this.currentIndex
      }
      this.videoMap.get(index).play()
    }
  }

  destroy() {
    for (const video of this.videoMap.values()) {
      video.remove()
    }
    this.videoMap.clear()
  }
}
