import {post, get} from "@/manager/apiManager";

export const signup = async (signupInfo) => {
  await post('/auth/signup', signupInfo)
}

export const login = async (loginInfo) => {
  const data = await post('/auth/login', loginInfo)
  sessionStorage.setItem("trinity-at", data['accessToken'])
}

export const userInfo = async () => {
  return await get('/user', {})
}