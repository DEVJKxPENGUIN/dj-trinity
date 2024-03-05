<template>
  <div class="chat flex flex-col w-full h-80 backdrop-blur-lg backdrop-brightness-125">
    <!-- TODO 여기서부터 -->
    <div class="top-bar flex flex-row h-6 anta-regular text-sm">
      CHATTING
    </div>
    <div class="list flex flex-1 flex-col" ref="chatList">
      <div v-for="(chat, index) in chats" class="item flex flex-row w-full items-center kode-mono"
           v-bind:key="index">
        <div v-if="chat.nickname" class="nickname flex w-28">
          <p class="truncate underline decoration-amber-200 decoration-8">{{ chat.nickname }}</p>
        </div>
        <div v-if="chat.nickname" class="flex w-4">
          <p>▶</p>
        </div>
        <div class="message flex flex-1 w-full text-wrap">
          <p class="">{{ chat.message }}</p>
        </div>
        <div class="time flex w-fit">
          [{{ formatTime(chat.sendTime) }}]
        </div>
      </div>
    </div>
    <div class="chatInput flex w-full kode-mono backdrop-blur-3xl">
      <textarea :value="chatInput" ref="chatInputRef" type="text" class="input w-full"
                :placeholder="placeHolder" @input="onInput" @focus="onFocus"
                @blur="onBlur"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "LobbyChat",
  props: {
    chats: {
      type: Array,
      default: () => []
    },
    chatInput: {
      type: String,
      default: ''
    }
  },
  watch: {
    chats: {
      handler() {
        this.$nextTick(() => {
          const elem = this.$refs.chatList
          elem.scrollTo(0, 999999)
        })
      },
      deep: true
    }
  },
  data() {
    return {
      placeHolder: '[SHIFT + ENTER]',
    }
  },
  methods: {
    formatTime(time) {
      const date = new Date(time);
      return date.toLocaleTimeString('en-GB',
          {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    },
    focus() {
      this.$refs.chatInputRef.focus()
    },
    blur() {
      this.$refs.chatInputRef.blur()
    },
    onInput(e) {
      this.$emit('update:chat-input', e.target.value)
    },
    onFocus() {
      this.placeHolder = 'type message..'
      this.$emit('inputFocus', true)
    },
    onBlur() {
      this.placeHolder = '[SHIFT + ENTER]'
      this.$emit('inputFocus', false)
    }
  }
}
</script>


<style scoped>
.chat {
  background-color: rgba(0, 0, 0, 0.3);
  overflow-y: hidden;
  -webkit-box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 0, 100% 100%, 25px 100%, 0 calc(100% - 25px), 0 0);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.list {
  overflow-y: scroll;
  overflow-x: hidden;
}

.item {
  opacity: 60%;
  font-size: 14px;
  height: 20px;
}

.nickname {
  margin-right: 10px;
}

.chatInput {

  .input {
    background: none;
    border: none;
    outline: none !important;
    resize: none;
    color: rgba(255, 255, 255, .7);
    font-size: 14px;
    height: 25px;
    padding-left: 25px;
  }
}
</style>