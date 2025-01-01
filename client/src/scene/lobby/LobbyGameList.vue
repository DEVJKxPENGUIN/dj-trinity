<template>
  <div class="musics flex flex-1 flex-col w-full backdrop-blur-lg backdrop-brightness-125">
    <div class="top-bar flex flex-row w-full h-6 anta-regular text-sm backdrop-blur-3xl">
      MUSICS
    </div>

    <div class="list flex flex-1 flex-col content-center" ref="list">
      <div v-for="(bms, index) in bmsShowList"
           class="item flex flex-1 w-full items-center text-xl orbitron-regular"
           v-bind:key="bms.name">
        <div class="back-effect h-fit p-2"
             :class="{'highlight' : isCurrentItem(index), 'no-transition' : !isCurrentItem(index),
             'slideUp' : toUp && isCurrentItem(index), 'slideDown' : toDown && isCurrentItem(index)}">
          0
        </div>
        <div class="w-full pl-3 text-gray-400 text-transition line-clamp-1"
             :class="{'highlight-text' : isCurrentItem(index), 'no-transition' : !isCurrentItem(index)}"
        >
          {{ bms.name.toUpperCase() }}
        </div>
      </div>
    </div>

    <div class="bottom-bar flex flex-row w-full h-6 anta-regular text-sm backdrop-blur-3xl">
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "LobbyGameList",
  props: {
    bmsShowList: {
      type: Array,
      default: () => {
      }
    },
    bmsCurrent: {
      type: Object,
      default: () => {
      }
    },
    toUp: {
      type: Boolean,
      default: false
    },
    toDown: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  mounted() {
    const list = this.$refs.list as HTMLDivElement
    list.addEventListener('wheel', this.prevent)
    list.addEventListener('mousedown', this.prevent)
  },
  data() {

  },
  methods: {
    prevent(e: Event) {
      e.preventDefault()
    },
    isCurrentItem(index: number) {
      return (this.bmsShowList.length - 1) / 2 === index
    }
  },
  beforeUnmount() {
    const list = this.$refs.list as HTMLDivElement
    list.removeEventListener('wheel', this.prevent)
    list.removeEventListener('mousedown', this.prevent)
  }
})
</script>


<style scoped>
.musics {
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
  opacity: 100%;
  position: relative;
}

.list-move, /* 움직이는 엘리먼트에 트랜지션 적용 */
.list-enter-active,
.list-leave-active {
  transition: all 0.1s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(100px);
}


/* 이동 애니메이션을 올바르게 계산할 수 있도록
   레이아웃 흐름에서 나머지 항목을 꺼내기. */
.list-leave-active {
  position: absolute;
}

/*
.highlight::before {
  transform: scaleX(0);
  transform-origin: bottom right;
}

 */

.back-effect {
  position: absolute;
  transition-property: width, background-color;
  transition-duration: .2s, .05s;
  transition-timing-function: ease-in-out;
  width: 20%;
  z-index: -1;
  color: transparent;
}

.no-transition {
  transition: none !important;
}

.highlight {
  width: 80%;
  background: linear-gradient(to right, ghostwhite, rgba(0, 0, 0, 0));
  animation: slideToUp .2s ease-out forwards;
}

.slideUp {
  animation: slideToUp .2s ease-out forwards;
}

.slideDown {
  animation: slideToDown .2s ease-out forwards;
}

@keyframes slideToUp {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideToDown {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}

.highlight-text {
  color: black;
}

.text-transition {
  transition-property: color;
  transition-duration: .4s;
  transition-timing-function: ease-out;
}

/*
.item::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0 0 0 0;
  background: hsl(200 100% 80%);
  z-index: -1;
  transition: transform .3s ease;
  transform: scaleX(0);
  transform-origin: bottom left;
}
 */

</style>