<template>
  <Popup
      :show="show"
  >
    <template #text>
      <div class="login-title anta-regular">
        ENTER GAME
      </div>
    </template>

    <template #form>
      <div class="flex flex-col w-4/6 login-form orbitron-regular">
        <div class="flex flex-row mt-5 mb-5 input-box w-full">
          <label for="nickname" class="input-desc">NICKNAME</label>
          <input class="input ml-5" id="nickname" ref="nickname" type="text" autocomplete="off"/>
        </div>
        <!--        <input class="input" type="password" placeholder="PASSWORD" />-->
        <div class="flex flex-row mt-5 mb-5 input-box w-full" tabindex="0" ref="newbie">
          <label for="password" class="input-desc">ARE YOU NEWBIE?</label>
        </div>
      </div>
    </template>

  </Popup>
</template>

<script>

import Popup from "@/scene/common/popup.vue";

const INIT = 'init'
export default {
  name: 'IntroSceneLogin',
  components: {Popup},
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  created() {
    window.addEventListener('keydown', this.keyboard)
    this.$nextTick(() => {
      this.$refs.nickname.focus()
    })
  },
  data() {
    return {
      // js
      state: INIT

      // view

    }
  },
  methods: {
    keyboard(e) {
      if (e.key === 'Enter') {
        this.handleEnter()
      } else if (e.key === 'ArrowUp') {
        this.handleArrowUp()
      } else if (e.key === 'ArrowDown') {
        this.handleArrowDown()
      }
    },
    handleEnter() {
      if (this.state === INIT) {
        this.handleInitMenuSelect()
        return
      }

    },
    handleArrowUp() {
      if (this.state === INIT) {
        this.$refs.nickname.focus()
        return
      }
    },
    handleArrowDown() {
      if (this.state === INIT) {
        this.$refs.newbie.focus()
        return
      }
    },
    handleInitMenuSelect() {
      if (this.$refs.nickname === document.activeElement) {
        this.switchToPassword()
        return
      }
      if (this.$refs.newbie === document.activeElement) {
        this.switchToSignup()
        return
      }
    },
    switchToPassword() {

    },
    switchToSignup() {

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
  color: rgba(255, 255, 255, .8);
  transition: .1s;
  animation: flicker .4s infinite;
}

input {
  background: rgba(0, 0, 0, 0);
  border: none;
  color: rgba(255, 255, 255, 0.8);
  outline: none;
}

@keyframes flicker {
  0%, 100% {
    opacity: .8;
  }
  50% {
    opacity: .65;
  }
}

</style>