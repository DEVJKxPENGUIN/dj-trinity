const serverHost = import.meta.env.VITE_SERVER_HOST
export const post = async (uri, data, onSuccess, onFail) => {
  try {
    // for loading page
    await sleep(3000)

    const response = await fetch(`${serverHost}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept":"application/json"
      },
      body: JSON.stringify(data)
    })

    const body = await response.json()
    if (body.code && body.code !== "0") {
      throw new Error(body.message)
    }

    await onSuccess(body)
  } catch (e) {
    console.error(e)
    await onFail(e.message)
  }
}

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));