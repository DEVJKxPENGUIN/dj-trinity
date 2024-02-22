const apiHost = import.meta.env.VITE_API_HOST
const gameHost = import.meta.env.VITE_GAME_HOST
export const post = async (uri, data) => {
  // for loading page
  await sleep(1000)

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
  if (body.code && body.code !== "0") {
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
  if (body.code && body.code !== "0") {
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

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));