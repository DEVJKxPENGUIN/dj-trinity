<template>
  <Popup
      :show="true"
  >
    <template #text>
      <div class="login-title anta-regular">
        ENTER GAME
      </div>
    </template>

    <template #form>

      <!-- INIT -->
      <div v-if="this.state === 'init'" class="flex flex-col w-4/6 orbitron-regular">
        <div class="flex flex-row mt-5 mb-5 input-box w-full">
          <label for="id" class="input-desc">ID</label>
          <input class="input ml-5" v-model="id" id="id" ref="id" type="text" autocomplete="off"
                 :disabled="isLoading"/>
        </div>
        <div v-if="idCheckMsg" :class="['orbitron-thin id-check', idCheckMsg ? 'shake': '']">
          {{ idCheckMsg }}
        </div>
        <div class="flex flex-row mt-5 mb-5 input-box w-full" tabindex="0" ref="newbie">
          <label for="password" class="input-desc">ARE YOU NEWBIE?</label>
        </div>
      </div>

      <!-- CHECK PASSWORD -->
      <div v-if="this.state === 'checkPassword'" class="flex flex-col w-4/6 orbitron-regular">
        <div class="flex flex-col color-main w-full">
          <p class="color-desc">[&nbsp;{{ user.nickname }}&nbsp;]</p>
          <p class="color-desc font-desc orbitron-thin">Enter your password when you're ready to
            enjoy it</p>
        </div>

        <div class="flex flex-row mt-5 mb-5 input-box w-full">
          <label for="password" class="input-desc">PASSWORD</label>
          <input class="input ml-5" v-model="password" id="password" ref="password" type="password"
                 autocomplete="off" :disabled="isLoading"/>
        </div>
        <div v-if="passwordCheckMsg"
             :class="['orbitron-thin id-check', passwordCheckMsg ? 'shake': '']">
          {{ passwordCheckMsg }}
        </div>
      </div>

      <!-- SIGN UP -->
      <div v-if="this.state === 'signup'" class="flex flex-col w-4/6 orbitron-regular">
        <div class="flex flex-col color-main w-full">
          <p class="color-desc">WELCOME TRINITY</p>
          <p class="color-desc font-desc orbitron-thin">MULTI PLAY RHYTHM GAME, BASED ON
            BE-MUSIC-SCRIPT</p>
        </div>

        <div class="flex flex-row mt-5 mb-5 input-box w-full">
          <label for="signupId" class="input-desc">ID</label>
          <input class="input ml-5" v-model="signupId" id="signupId" ref="signupId" type="text"
                 autocomplete="off"
                 :disabled="isLoading"/>
        </div>
        <div class="flex flex-row mt-5 mb-5 input-box w-full">
          <label for="signupPassword" class="input-desc">PASSWORD</label>
          <input class="input ml-5" v-model="signupPassword" id="signupPassword"
                 ref="signupPassword" type="password" autocomplete="off"
                 :disabled="isLoading"/>
        </div>
        <div class="flex flex-row mt-5 mb-5 input-box w-full">
          <label for="signupPasswordCheck" class="input-desc">CONFIRM</label>
          <input class="input ml-5" v-model="signupPasswordCheck" id="signupPasswordCheck"
                 ref="signupPasswordCheck" type="password" autocomplete="off"
                 placeholder="repeat password again"
                 :disabled="isLoading"/>
        </div>
        <div v-if="signupCheckMsg"
             :class="['orbitron-thin id-check', signupCheckMsg ? 'shake': '']">
          {{ signupCheckMsg }}
        </div>
      </div>
    </template>

  </Popup>
</template>

<script>

import Popup from "@/scene/common/popup.vue";
import * as apiHelper from "@/manager/apiManager";
import * as authenticationManager from "@/manager/authenticationManager";
import {mapActions, mapState} from "vuex";

const INIT = 'init'
const CHECK_PASSWORD = 'checkPassword'
const SIGNUP = 'signup'
export default {
  name: 'IntroSceneLogin',
  components: {Popup},
  computed: {
    ...mapState(['isLoading', 'isSystemPopup'])
  },
  created() {
    window.addEventListener('keydown', this.keyboard)
    this.$nextTick(() => {
      this.$refs.id.focus()
    })
  },
  data() {
    return {
      // js
      idCheckMsg: '',
      passwordCheckMsg: '',
      signupCheckMsg: '',
      state: INIT,

      // view
      id: '',
      password: '',
      user: {},
      signupId: '',
      signupPassword: '',
      signupPasswordCheck: ''

    }
  },
  methods: {
    ...mapActions(['showSystemPopup', 'showLoading', 'hideLoading']),
    keyboard(e) {
      if (this.isLoading || this.isSystemPopup) {
        return
      }

      if (e.key === 'Enter') {
        this.handleEnter()
      } else if (e.key === 'ArrowUp') {
        this.handleArrowUp()
      } else if (e.key === 'ArrowDown') {
        this.handleArrowDown()
      } else if (e.key === 'Escape') {
        this.handleEsc()
      }
    },
    handleEnter() {
      if (this.state === INIT) {
        this.handleInitMenuSelect()
        return
      }
      if (this.state === CHECK_PASSWORD) {
        this.handleCheckPassword()
        return
      }
      if (this.state === SIGNUP) {
        this.handleSignup()
      }
    },
    handleArrowUp() {
      if (this.state === INIT) {
        this.$refs.id.focus()
        return
      }
      if (this.state === SIGNUP) {
        const active = document.activeElement
        if (this.$refs.signupId === active) {
          this.$refs.signupId.focus()
        } else if (this.$refs.signupPassword === active) {
          this.$refs.signupId.focus()
        } else if (this.$refs.signupPasswordCheck === active) {
          this.$refs.signupPassword.focus()
        } else {
          this.$refs.signupId.focus()
        }
        return
      }
    },
    handleArrowDown() {
      if (this.state === INIT) {
        this.$refs.newbie.focus()
        return
      }
      if (this.state === SIGNUP) {
        const active = document.activeElement
        if (this.$refs.signupId === active) {
          this.$refs.signupPassword.focus()
        } else if (this.$refs.signupPassword === active) {
          this.$refs.signupPasswordCheck.focus()
        } else if (this.$refs.signupPasswordCheck === active) {
          this.$refs.signupPasswordCheck.focus()
        } else {
          this.$refs.signupPasswordCheck.focus()
        }
        return
      }
    },
    handleEsc() {
      if (this.state === INIT) {
        this.$emit('close')
        return
      }
      if (this.state === CHECK_PASSWORD) {
        this.state = INIT
        this.id = ''
        this.password = ''
        this.passwordCheckMsg = ''
        this.$nextTick(() => {
          this.$refs.id.focus()
        })
        return
      }
      if (this.state === SIGNUP) {
        this.state = INIT
        this.id = ''
        this.signupId = ''
        this.signupPassword = ''
        this.signupPasswordCheck = ''
        this.$nextTick(() => {
          this.$refs.id.focus()
        })
      }
    },
    handleInitMenuSelect() {
      const active = document.activeElement
      if (this.$refs.id === active) {
        this.checkUserId(this.switchToPassword)
        return
      }
      if (this.$refs.newbie === active) {
        this.switchToSignup()
        return
      }
    },
    handleCheckPassword() {
      const active = document.activeElement
      if (this.$refs.password === active) {
        this.checkPassword(this.switchToEnterChannel)
      }
    },
    handleSignup() {
      const active = document.activeElement
      if (this.$refs.signupId === active || this.$refs.signupPassword === active
          || this.$refs.signupPasswordCheck === active) {
        this.signup(this.signupSuccess)
      }
    },
    async checkUserId(callback) {
      try {
        this.showLoading()
        if (!this.id) {
          throw new Error('ID is empty')
        }
        const result = await apiHelper.get('/auth/user/' + this.id)
        this.user = result
        callback()
      } catch (e) {
        this.idCheckMsg = ''
        this.$nextTick(() => {
          this.idCheckMsg = e.message.toUpperCase()
        })
      } finally {
        this.hideLoading()
        this.$nextTick(() => {
          if (this.$refs.id) {
            this.$refs.id.focus()
          }
        })
      }
    },
    async checkPassword(callback) {
      try {
        this.showLoading()
        if (!this.password) {
          throw new Error('Password is empty')
        }
        await authenticationManager.login({
          id: this.id,
          password: this.password
        })
        callback()
      } catch (e) {
        this.passwordCheckMsg = ''
        this.$nextTick(() => {
          this.passwordCheckMsg = e.message.toUpperCase()
        })
      } finally {
        this.hideLoading()
        this.$nextTick(() => {
          if (this.$refs.password) {
            this.$refs.password.focus()
          }
        })
      }
    },
    async signup(callback) {
      const active = document.activeElement
      try {
        this.showLoading()
        if (!this.signupId) {
          throw new Error('id is empty')
        }
        if (!this.signupPassword) {
          throw new Error('Password is empty')
        }
        if (!this.signupPasswordCheck) {
          throw new Error('confirm is empty')
        }
        await authenticationManager.signup({
          id: this.signupId,
          password: this.signupPassword,
          passwordCheck: this.signupPasswordCheck
        })
        callback()
      } catch (e) {
        this.signupCheckMsg = ''
        this.$nextTick(() => {
          this.signupCheckMsg = e.message.toUpperCase()
        })
      } finally {
        this.hideLoading()
        this.$nextTick(() => {
          if (active) {
            active.focus()
          }
        })
      }

    },
    signupSuccess() {
      this.signupCheckMsg = ''
      this.showSystemPopup({
        title: 'Congratulations on joining trinity.',
        contents: 'Log in with your account and enjoy the bms rhythm game world.',
        button: 'GO TO LOGIN',
        callback: this.handleEsc
      })
    },
    switchToPassword() {
      this.idCheckMsg = ''
      this.state = CHECK_PASSWORD
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    switchToSignup() {
      this.idCheckMsg = ''
      this.state = SIGNUP
      this.$nextTick(() => {
        this.$refs.signupId.focus()
      })
    },
    switchToEnterChannel() {
      this.passwordCheckMsg = ''
      this.$emit('loginSuccess')
    },
    shake(el, done) {
      el.classList.add('shake')
      done()
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyboard)
  }

}
</script>

<style scoped>
.login-title {
  font-size: 40px;
  color: white;
}

.color-main {
  color: rgba(255, 255, 255, .9);
}

.color-desc {
  color: rgba(255, 255, 255, 0.6);
}

.font-desc {
  font-size: 10px;
}

.input-box {
  color: rgba(255, 255, 255, 0.3);
}

.input-box:focus-within {

  --s: 10px; /* the size on the corner */
  --t: 2px; /* the thickness of the border */
  --g: 5px; /* the gap between the border and image */

  padding: calc(var(--g) + var(--t));
  outline: var(--t) solid rgba(255, 255, 255, 0.5); /* the color here */
  outline-offset: calc(-1 * var(--t));
  mask: conic-gradient(at var(--s) var(--s), #0000 75%, #000 0) 0 0/calc(100% - var(--s)) calc(100% - var(--s)),
  linear-gradient(#000 0 0) content-box;
  transition: .1s;
  background: rgba(0, 0, 0, 0);
}

.input-box:focus-within .input-desc {
  color: rgba(255, 255, 255, .9);
  transition: .1s;
  animation: flicker .4s infinite;
}

input {
  background: rgba(0, 0, 0, 0);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  outline: none;
}

input::placeholder {
  text-align: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
}

.id-check {
  color: rgba(255, 0, 255, .9);
  font-size: 14px;
  text-align: center;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-3px);
  }
  40%, 80% {
    transform: translateX(3px);
  }
}

.shake {
  display: inline-block;
  animation: shake 0.1s ease;
}

</style>