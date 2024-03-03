const apiHost = process.env.VUE_APP_API_HOST
const gameHost = process.env.VUE_APP_GAME_HOST
export const post = async (uri, data) => {

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
  if(body.code && body.code === "-11") {
    await refreshToken()
    return await post(uri, data)
  } else if (body.code && body.code !== "0") {
    throw new Error(body.message)
  }

  return body.data
}

export const get = async (uri, data) => {

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
  if(body.code && body.code === "-11") {
    await refreshToken()
    return await get(uri, data)
  } else if (body.code && body.code !== "0") {
    throw new Error(body.message)
  }

  return body.data
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

const refreshToken = async () => {
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
    // todo 최상단 popup 및 App.vue 에 emit 을 통해 첫화면으로 돌아가야 한다.
    throw new Error(body.message)
  }

  sessionStorage.setItem("trinity-at", body.data['accessToken'])
}