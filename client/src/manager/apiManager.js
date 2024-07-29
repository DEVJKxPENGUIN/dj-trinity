import store from "@/store/store";
import {_vue_app} from "@/main";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import {toBlobURL} from "@ffmpeg/util";

const apiHost = process.env.VUE_APP_API_HOST
const gameHost = process.env.VUE_APP_GAME_HOST
export const post = async (uri, data, onExpired) => {

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
  if (sessionStorage.getItem("trinity-at") !== null) {
    headers.Authorization = "bearer " + sessionStorage.getItem("trinity-at")
  }

  const response = await fetch(`${apiHost}${uri}`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
    credentials: "include"
  })

  const body = await response.json()

  // session expired
  if (body.code && body.code === "-11") {
    const refreshed = await refreshToken(onExpired)
    if (refreshed) {
      return await post(uri, data)
    }
  } else if (body.code && body.code !== "0") {
    throw new Error(body.message)
  }

  return body.data
}

export const get = async (uri, data, onExpired) => {

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
  if (sessionStorage.getItem("trinity-at") !== null) {
    headers.Authorization = "bearer " + sessionStorage.getItem("trinity-at")
  }

  let queryString = new URLSearchParams(data).toString()
  if (queryString) {
    queryString = '?' + queryString
  }
  const response = await fetch(`${apiHost}${uri}${queryString}`, {
    method: "GET",
    headers: headers,
    credentials: "include"
  })

  const body = await response.json()

  // session expired
  if (body.code && body.code === "-11") {
    const refreshed = await refreshToken(onExpired)
    if (refreshed) {
      return await get(uri, data)
    }
  } else if (body.code && body.code !== "0") {
    throw new Error(body.message)
  }

  return body.data
}

export const getVideo = async (uri, video) => {

  // setup ffmpeg
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
  const ffmpeg = new FFmpeg()
  ffmpeg.on('log', ({message}) => {
    console.log(message);
  })

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`,
        'application/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`,
        'application/javascript')
  })

  const response = await fetch(`${apiHost}${uri}`)

  if (!response.ok) {
    throw new Error('Network response was not ok.')
  }

  const arrayBuffer = await response.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  const ext = response.headers.get('Content-type').split('/')[1]
  await ffmpeg.writeFile(`input.${ext}`, uint8Array)

  await ffmpeg.exec([
    '-i', `input.${ext}`,
    '-preset', 'ultrafast',
    '-threads', '0',
    'output.mp4'
  ]);

  const output = await ffmpeg.readFile('output.mp4')
  const blob = new Blob([output.buffer], {type: 'video/mp4'})
  const videoUrl = URL.createObjectURL(blob)
  video.src = videoUrl
  video.load()
}

export const createSocket = (path, onOpen, onMessage, onClose) => {
  const socket = new WebSocket(`${gameHost}/ws${path}`)
  socket.onopen = (e) => {
    socket.send(JSON.stringify({
      type: "AUTHORIZATION",
      token: sessionStorage.getItem("trinity-at")
    }))

    onOpen(e)
  }
  socket.onmessage = onMessage
  socket.onclose = onClose
  return socket
}

const refreshToken = async (onExpired) => {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }

  if (sessionStorage.getItem("trinity-at") !== null) {
    headers.Authorization = "bearer " + sessionStorage.getItem("trinity-at")
  }

  const response = await fetch(`${apiHost}/auth/refresh`, {
    method: "POST",
    headers: headers,
    credentials: "include"
  })

  const body = await response.json()

  // refresh token 발급 실패, 재로그인 필요.
  if (body.code && body.code !== "0") {
    if (onExpired) {
      onExpired()
    } else {
      // todo 최상단 popup 및 App.vue 에 emit 을 통해 첫화면으로 돌아가야 한다.
      await store.dispatch('showSystemPopup', {
        title: 'Re-login need.',
        contents: 'Your session expired, Going back start page and re-login please.',
        button: 'OK',
        callback: () => {
          _vue_app.changeScene('introScene')
        }
      })
    }
    return false
  }

  sessionStorage.setItem("trinity-at", body.data['accessToken'])
  return true
}