const serverHost = import.meta.env.VITE_SERVER_HOST
export const post = async (uri, data) => {
  // for loading page
  await sleep(2000)

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
  if (sessionStorage.getItem("trinity-at") !== null) {
    headers.Authorization = sessionStorage.getItem("trinity-at")
  }

  const response = await fetch(`${serverHost}${uri}`, {
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

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));