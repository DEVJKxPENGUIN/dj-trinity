// @ts-ignore
import IntroSceneManager from './intro/introSceneManager.js'
import WebGL from "three/addons/capabilities/WebGL.js";
import Context from "./context";

const context = new Context(true)

let currentScene;
currentScene = new IntroSceneManager(context)
if (WebGL.isWebGLAvailable()) {
  await currentScene.init()
} else {
  const warning = WebGL.getWebGLErrorMessage()
  document.getElementById('container').appendChild(warning)
}

// Remove Preload scripts loading
postMessage({payload: 'removeLoading'}, '*')

// Use contextBridge
// window.ipcRenderer.on('main-process-message', (_event, message) => {
//   console.log(message)
// })
