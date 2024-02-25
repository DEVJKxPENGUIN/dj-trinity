<template>
  <div class="intro flex flex-col w-full h-full">
    <div class="flex-1"></div>
    <div class="flex flex-1 flex-row">
      <div class="flex-1"/>

      <!-- logo -->
      <div class="flex flex-col flex-1 logo items-center justify-center">
        <div class="anta-regular">
          <transition-group name="flip" tag="div">
            <div>
              <div class="sub-logo">DJ"TECHNICIAN</div>
              <div class="main-logo ">
                TRINITY
              </div>
            </div>

            <div v-if="showMenu" class="menu orbitron-regular">
              <div
                  v-for="(item, index) in menus"
                  :class="['menu-text', selected === index ? 'active ping' : '' ]"
                  :key="index"
                  :ref="`menu-${index}`"
                  tabindex="-1"
              >{{ item }}
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div class="flex flex-1 justify-center items-center">
      <!-- press enter -->
      <div v-if="showPressEnter" class="anta-regular press-enter ping2">
        PRESS ENTER TO START
      </div>
    </div>
    <Popup v-if="showLogin">

    </Popup>
  </div>
</template>

<script>

import Popup from "@/scene/common/popup.vue";

const PRESS_ENTER = 'pressEnter'
const MENU_SELECT = 'menuSelect'
const LOGIN = 'LOGIN'
export default {
  name: 'App',
  components: {Popup},
  created() {
    this.init()
  },
  data() {
    return {
      // js
      showPressEnter: true,
      showMenu: false,
      showLogin: false,
      state: PRESS_ENTER,

      // view
      selected: 0,
      menus: [
        'ENTER GAME',
        'RANK',
        'SETTINGS',
        'CREDITS',
        'QUIT']
    }
  },
  methods: {
    async init() {
      window.addEventListener('keydown', this.keyboard)
    },
    keyboard(e) {
      if (e.key === 'ArrowUp') {
        this.selected = this.selected === 0 ? this.selected : this.selected - 1
      } else if (e.key === 'ArrowDown') {
        this.selected = this.selected === this.menus.length - 1 ? this.selected
            : this.selected + 1
      } else if (e.key === 'Enter') {
        this.handleEnter()
      } else if(e.key === 'Escape') {
        this.handleEsc()
      }
    },
    handleEnter() {
      if (this.state === PRESS_ENTER) {
        this.switchToMenuSelect()
        return
      }

      if (this.state === MENU_SELECT) {
        this.handleMenuSelect()
        return
      }
    },
    handleEsc() {
      if(this.state === MENU_SELECT) {
        this.switchToPressEnter()
      }

      if(this.state === LOGIN) {
        this.switchToMenuSelect()
      }

    },
    handleMenuSelect() {
      const selected = this.menus[this.selected]
      if (selected === "ENTER GAME") {
        this.switchToLogin()
        return
      }

    },
    switchToPressEnter() {
      this.showLogin = false
      this.showMenu = false;
      this.showPressEnter = true
      this.state = PRESS_ENTER
    },
    switchToMenuSelect() {
      this.showLogin = false
      this.showMenu = true
      this.showPressEnter = false
      this.state = MENU_SELECT
    },
    switchToLogin() {
      this.showLogin = true
      this.showMenu = true
      this.showPressEnter = false
      this.state = LOGIN
    }
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.keyboard)
  }
}

</script>

<style scoped>
.press-enter {
  font-size: 30px;
  color: white;
  opacity: 0.01;
}

.logo {
  font-size: 30px;
  color: white;
  text-align: center;
  opacity: 1;
}

.sub-logo {
  opacity: 0.3;
}

.main-logo {
  font-size: 80px;
  opacity: 0.9;
}

.menu {
  margin-top: 30px;
  font-size: 18px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-text {
  margin-top: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  width: 300px;
  border-left: solid rgba(255, 255, 255, 0.3) 1px;
  border-right: solid rgba(255, 255, 255, 0.3) 1px;
  letter-spacing: 10px;
  opacity: 0.4;
}

.menu .active {
  outline: none;
  cursor: pointer;
  opacity: 0.6;
}

.ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.ping2 {
  animation: ping2 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.04);
    opacity: .9;
  }
}

@keyframes ping2 {
  75%, 100% {
    transform: scale(1);
    opacity: .5;
  }
}

.flip-move {
  transition: transform 0.15s ease-in-out;
}

</style>