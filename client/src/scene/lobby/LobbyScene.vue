<template>
  <div class="flex w-full h-full orbitron-thin text-white">
    <div class="lobby-col flex flex-col w-full h-full">
      <div class="flex flex-row-reverse top-bar h-20">
        <div class="flex w-full">
        </div>
      </div>
      <div class="flex flex-1 justify-center items-center">
      </div>
      <div class="flex h-24"/>
    </div>

    <div class="lobby-row flex flex-row w-full h-full p-2">
      <div class="flex flex-col w-0 lg:w-72 overflow-hidden">
        <span class="anta-regular text-sm">{{ channelId.toUpperCase() }}</span>
        <LobbyProfile :user="user" class="mt-1"/>
        <LobbyUsers :users="channelUsers" class="mt-1"/>
      </div>
      <div class="flex flex-1 flex-col h-full ml-2 mr-2">
        <LobbyMusicSelect :bms-current="bmsCurrent" />
        <LobbyChat ref="chat" :chats="channelChats" v-model:chat-input="chatInput" class="mt-1"
                   @inputFocus="handleChatInputFocus"/>
      </div>
      <div class="flex flex-1 flex-col">
        <div class="flex h-40"></div>
        <LobbyGameList :bms-show-list="bmsShowList" :bms-current="bmsCurrent" :to-down="toDown" :to-up="toUp"
                       class="mt-1"/>
      </div>
    </div>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex";
import LobbyCanvas from "@/scene/lobby/LobbyCanvas";
import LobbySocket from "@/scene/lobby/LobbySocket";
import * as apiManager from "@/manager/apiManager";
import {get} from "@/manager/apiManager";
import * as authenticationManager from "@/manager/authenticationManager";
import LobbyProfile from "@/scene/lobby/LobbyProfile.vue";
import LobbyUsers from "@/scene/lobby/LobbyUsers.vue";
import LobbyChat from "@/scene/lobby/LobbyChat.vue";
import LobbyGameList from "@/scene/lobby/LobbyGameList.vue";
import LobbyMusicSelect from "@/scene/lobby/LobbyMusicSelect.vue";

const STANDBY = 'standby'
const CHATINPUT = 'chatinput'
export default {
  name: 'LobbyScene',
  components: {LobbyMusicSelect, LobbyGameList, LobbyChat, LobbyUsers, LobbyProfile},
  computed: {
    ...mapState(['isLoading', 'isSystemPopup']),
  },
  props: {
    manager: null
  },
  created() {
    this.init()
  },
  data() {
    return {
      // js
      state: STANDBY,
      beforeState: STANDBY,

      // view
      channelId: '',
      user: {},
      channelUsers: [],
      channelChats: [],
      chatInput: '',
      bmsList: [],
      bmsShowList: [],
      bmsCurrent: {},
      bmsVIndex: 0,
      bmsHIndex: 0,
      bmsMaxShowSize: 13,
      toUp: false,
      toDown: false
    }
  },
  methods: {
    ...mapActions(['showSystemPopup', 'showLoading', 'hideLoading', 'hideSceneChange']),
    async init() {
      this.user = await authenticationManager.userInfo()
      this.bmsList = await apiManager.get('/bms/list', {})
      this.initBms()
      await this.manager.initScene(
          new LobbyCanvas(this),
          new LobbySocket(this)
      )
      window.addEventListener('keydown', this.keyboard)
      setTimeout(async () => {
        await this.hideSceneChange()
      }, 1000)
    },
    keyboard(e) {
      if (this.isLoading || this.isSystemPopup) {
        return
      }

      if (e.key === 'ArrowUp') {
        this.handleArrowUp()
      } else if (e.key === 'ArrowDown') {
        this.handleArrowDown()
      } else if (e.key === 'ArrowLeft') {
        this.handleArrowLeft()
      } else if (e.key === 'ArrowRight') {
        this.handleArrowRight()
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        this.handleShiftEnter()
      } else if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault()
        this.handleEnter()
      } else if (e.key === 'Escape') {
        this.handleEsc()
      }
    },
    handleEnter() {
      if (this.state === CHATINPUT) {
        this.sendChat()
        return
      }
    },
    handleShiftEnter() {
      if (this.state === STANDBY) {
        this.openChat()
        return
      }
    },
    handleArrowUp() {
      if (this.state === STANDBY) {
        this.bmsUp()
        return
      }

    },
    handleArrowDown() {
      if (this.state === STANDBY) {
        this.bmsDown()
        return
      }
    },
    handleArrowLeft() {
      if (this.state === STANDBY) {
        this.bmsLeft()
        return
      }
    },
    handleArrowRight() {
      if (this.state === STANDBY) {
        this.bmsRight()
        return
      }
    },
    handleEsc() {
      if (this.state === CHATINPUT) {
        this.outChat()
        return
      }

    },
    handleChatInputFocus(focus) {
      if (focus) {
        this.openChat()
        return
      }

      this.outChat()
    },
    async enterChannel(channelInfo) {
      this.channelId = channelInfo['channelId']
      await this.updateChannel(channelInfo)
    },
    async updateChannel(channelInfo) {
      this.channelUsers = (await get('/users', {userIds: channelInfo['users'].join(',')}))
      .filter(user => user.id !== this.user.id)
    },
    async updateChatBox(receivedChat) {
      this.channelChats.push(receivedChat)
    },
    openChat() {
      this.state = CHATINPUT
      this.$refs.chat.focus()
    },
    sendChat() {
      if (!this.chatInput) {
        return
      }

      this.manager.socket.sendChat(this.user.nickname, this.chatInput)
      this.chatInput = ''
    },
    outChat() {
      this.state = STANDBY
      this.$refs.chat.blur()
      this.chatInput = ''
    },
    bmsUp() {
      if (this.bmsVIndex === 0) {
        this.bmsVIndex = Object.keys(this.bmsList).length - 1
      } else {
        this.bmsVIndex--
      }
      this.bmsHIndex = 0
      this.bmsCurrent = this.bmsList[Object.keys(this.bmsList)[this.bmsVIndex]][this.bmsHIndex]

      this.bmsShowList.pop()
      let index = this.bmsVIndex - (this.bmsMaxShowSize - 1) / 2
      if (index < 0) {
        index = Object.keys(this.bmsList).length + index
      }
      this.bmsShowList.unshift({
        name: Object.keys(this.bmsList)[index],
        item: this.bmsList[Object.keys(this.bmsList)[index]]
      })

      this.toUp=true
      this.toDown=false
    },
    bmsDown() {
      if (this.bmsVIndex === Object.keys(this.bmsList).length - 1) {
        this.bmsVIndex = 0
      } else {
        this.bmsVIndex++
      }
      this.bmsHIndex = 0
      this.bmsCurrent = this.bmsList[Object.keys(this.bmsList)[this.bmsVIndex]][this.bmsHIndex]

      this.bmsShowList.shift()
      let index = this.bmsVIndex + (this.bmsMaxShowSize - 1) / 2
      if (index > Object.keys(this.bmsList).length - 1) {
        index = index - Object.keys(this.bmsList).length
      }
      this.bmsShowList.push({
        name: Object.keys(this.bmsList)[index],
        item: this.bmsList[Object.keys(this.bmsList)[index]]
      })

      this.toUp=false
      this.toDown=true
    },
    bmsLeft() {
      this.bmsHIndex = (this.bmsHIndex - 1) < 0 ? 0 : this.bmsHIndex - 1
      this.bmsCurrent = this.bmsList[Object.keys(this.bmsList)[this.bmsVIndex]][this.bmsHIndex]
    },
    bmsRight() {
      const length = this.bmsList[Object.keys(this.bmsList)[this.bmsVIndex]].length
      this.bmsHIndex = (this.bmsHIndex + 1) > length - 1 ? length - 1 : this.bmsHIndex + 1
      this.bmsCurrent = this.bmsList[Object.keys(this.bmsList)[this.bmsVIndex]][this.bmsHIndex]
    },
    initBms() {
      this.bmsShowList = []
      const list = Object.keys(this.bmsList)
      const length = list.length

      // upper
      const half = (this.bmsMaxShowSize - 1) / 2
      let startIndex = this.bmsVIndex - half;
      if (this.bmsVIndex - half < 0) {
        startIndex = length + (this.bmsVIndex - half)
      }
      for (let i = 0; i < half; i++) {
        let index = startIndex + i
        if (startIndex + i >= length) {
          index = startIndex + i - length
        }
        this.bmsShowList.push({
          name: list[index],
          item: this.bmsList[list[index]]
        })
      }

      //current
      this.bmsShowList.push({
        name: list[this.bmsVIndex],
        item: this.bmsList[list[this.bmsVIndex]]
      })
      this.bmsCurrent = this.bmsList[list[this.bmsVIndex]][this.bmsHIndex]

      // bottom
      for (let i = 0; i < half; i++) {
        let index = this.bmsVIndex + i + 1
        if (this.bmsVIndex + i + 1 >= length) {
          index = this.bmsVIndex + i + 1 - length
        }
        this.bmsShowList.push({
          name: list[index],
          item: this.bmsList[list[index]]
        })
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyboard)
  }
}

</script>

<style scoped>
.lobby-col {
  position: fixed;
}

.lobby-row {
  position: fixed;
}

.top-bar {
  background: linear-gradient(to bottom, black, rgba(0, 0, 0, 0));
  /*background-color: greenyellow; */
}

</style>