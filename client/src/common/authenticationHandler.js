import * as serverHandler from "./serverHandler";

export const signup = async (signupInfo, onSuccess, onFailure) => {
  try {
    await serverHandler.post('/auth/signup', signupInfo)
    await onSuccess()
  } catch (e) {
    console.error(e)
    await onFailure(e.message)
  }
}

export const login = async (loginInfo, onSuccess, onFailure) => {
  try {
    const data = await serverHandler.post('/auth/login', loginInfo)
    sessionStorage.setItem("trinity-at", data['accessToken'])
    await onSuccess()
  } catch (e) {
    console.error(e)
    await onFailure(e.message)
  }
}