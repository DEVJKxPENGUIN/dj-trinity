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
        <div class="flex check-password w-full">
          <p class="color-desc">WELCOME</p>&nbsp;&nbsp;{{ user.nickname }}!
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


    </template>

  </Popup>
</template>

<script>

import Popup from "@/scene/common/popup.vue";
import * as apiHelper from "@/manager/apiManager";
import * as authenticationManager from "@/manager/authenticationManager";

const INIT = 'init'
const CHECK_PASSWORD = 'checkPassword'
export default {
  name: 'IntroSceneLogin',
  components: {Popup},
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
      state: INIT,
      isLoading: false,

      // view
      id: '',
      password: '',
      user: {}

    }
  },
  methods: {
    keyboard(e) {
      if (this.isLoading) {
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

    },
    handleArrowUp() {
      if (this.state === INIT) {
        this.$refs.id.focus()
        return
      }
    },
    handleArrowDown() {
      if (this.state === INIT) {
        this.$refs.newbie.focus()
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
      }

    },
    handleInitMenuSelect() {
      if (this.$refs.id === document.activeElement) {
        this.checkUserId(this.switchToPassword)
        return
      }
      if (this.$refs.newbie === document.activeElement) {
        this.switchToSignup()
        return
      }
    },
    handleCheckPassword() {
      if (this.$refs.password === document.activeElement) {
        this.checkPassword(this.switchToEnterChannel)
      }
    },
    async checkUserId(callback) {
      try {
        this.isLoading = true
        if (!this.id) {
          throw new Error('ID is empty')
        }
        const result = await apiHelper.get('/user/' + this.id)
        this.user = result
        callback()
      } catch (e) {
        this.idCheckMsg = ''
        this.$nextTick(() => {
          this.idCheckMsg = e.message.toUpperCase()
        })
      } finally {
        this.isLoading = false
        this.$nextTick(() => {
          if (this.$refs.id) {
            this.$refs.id.focus()
          }
        })
      }
    },
    async checkPassword(callback) {
      try {
        this.isLoading = true
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
        this.isLoading = false
        this.$nextTick(() => {
          if (this.$refs.password) {
            this.$refs.password.focus()
          }
        })
      }
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

.color-desc {
  color: rgba(255, 255, 255, 0.6);
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

@keyframes flicker {
  0%, 100% {
    opacity: .9;
  }
  50% {
    opacity: .65;
  }
}

.id-check {
  color: fuchsia;
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

.check-password {
  color: rgba(255, 255, 255, .9);
}
</style>