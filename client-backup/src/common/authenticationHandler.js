import * as serverHandler from "./serverHandler";

export const signup = async (signupInfo) => {
  await serverHandler.post('/auth/signup', signupInfo)
}

export const login = async (loginInfo) => {
  const data = await serverHandler.post('/auth/login', loginInfo)
  sessionStorage.setItem("trinity-at", data['accessToken'])
}

export const userInfo = async () => {
  return await serverHandler.get('/user', {})
}