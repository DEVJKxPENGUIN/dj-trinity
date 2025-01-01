import {get, post} from "@/manager/apiManager";

export const signup = async (signupInfo) => {
  await sleep(1000)
  await post('/auth/signup', signupInfo)
}

export const login = async (loginInfo) => {
  await sleep(1000)
  const data = await post('/auth/login', loginInfo)
  sessionStorage.setItem("trinity-at", data['accessToken'])
}

export const userInfo = async (onExpired: Function | null = null): Promise<any> => {
  return await get('/user', {}, onExpired)
}

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
