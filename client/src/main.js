// @ts-ignore
import IntroSceneManager from './intro/introSceneManager.js'
import WebGL from "three/addons/capabilities/WebGL.js";
import Context from "./context";
import LobbySceneManager from "./robby/lobbySceneManager";

// fixme - for debug
const context = new Context(true, new IntroSceneManager())
// const context = new Context(true, new LobbySceneManager())

if (WebGL.isWebGLAvailable()) {
  await context.init()
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
