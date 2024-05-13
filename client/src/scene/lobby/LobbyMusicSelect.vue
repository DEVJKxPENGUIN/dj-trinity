<template>
  <div class="music-select flex flex-col h-full justify-center items-center">
    <div class="top-bar flex h-10p"></div>
    <div class="center-bar flex h-60p justify-center w-full">
      <div class="record flex">
        <img class="opacity-50" :src="'http://localhost:5002/download/bms/stage/' + bmsCurrent.id"/>
      </div>
      <div
          class="title flex orbitron-regular w-full text-center items-end p-5 justify-center h-full">
        <b class="text-3xl line-clamp-1 ">
          <span>{{ bmsCurrent.bmsHeader.title }}</span>
        </b>
      </div>
      <div class="arrow-box flex w-full h-full absolute items-center">
        <div class="flex justify-between w-full p-5">
          <div :class="['arrow-left', showLeft ? '' : 'opacity-0']" id="arrow-left"></div>
          <div :class="['arrow-right', showRight ? '' : 'opacity-0']" id="arrow-right"></div>
        </div>
      </div>
    </div>
    <div class="bottom-bar flex kode-mono-bold h-30p w-full mt-1">
      <div
          class="current-bms flex flex-col w-full h-full overflow-hidden backdrop-blur-lg anta-regular backdrop-brightness-125">
        <div class="top-bar flex flex-row h-6 text-sm backdrop-blur-3xl">
          [&nbsp;{{ bmsHIndex + 1 }}&nbsp;/&nbsp;{{ bmsVCurrent.length }}&nbsp;]&nbsp;{{
            bmsDirCurrent
          }}
        </div>
        <div class="flex flex-row">
          <div class="w-32">TITLE</div>
          <div class="flex">
            {{ bmsCurrent.bmsHeader.title }}
          </div>
        </div>
        <div class="flex flex-row">
          <div class="w-32">ARTIST</div>
          <div class="flex">
            {{ bmsCurrent.bmsHeader.artist }}
          </div>
        </div>
        <div class="flex flex-row">
          <div class="w-32">GENRE</div>
          <div class="flex">
            {{ bmsCurrent.bmsHeader.genre }}
          </div>
        </div>
        <div class="flex flex-wrap">
          <div class="flex flex-row w-1/2">
            <div class="w-32">DIFFICULTY</div>
            <div class="flex">
              {{ bmsCurrent.bmsHeader.difficulty }}
            </div>
          </div>
          <div class="flex flex-row w-1/2">
            <div class="w-32">LEVEL</div>
            <div class="flex">
              {{ bmsCurrent.bmsHeader.playLevel }}
            </div>
          </div>
          <div class="flex flex-row w-1/2">
            <div class="w-32">BPM</div>
            <div class="flex">
              {{ bmsCurrent.bmsHeader.startBpm }}
            </div>
          </div>
          <div class="flex flex-row w-1/2">
            <div class="w-32">TOTAL</div>
            <div class="flex">
              {{ bmsCurrent.bmsHeader.total }}
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import {gsap} from "gsap";

export default {
  name: "LobbyMusicSelect",
  props: {
    bmsCurrent: {
      type: Object,
      default: () => {
      }
    },
    bmsVCurrent: {
      type: Object,
      default: () => {
      }
    },
    bmsDirCurrent: {
      type: String,
      default: ''
    },
    bmsHIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showLeft: false,
      showRight: false,
    }
  },
  watch: {
    bmsCurrent(current, before) {
      if (!this.isVCurrentChanged(before)) {
        this.animateArrow(this.isRightChanged(current, before))
      }
      setTimeout(() => {
        this.handleArrowShowing()
      }, 200)

    }
  },
  methods: {
    isVCurrentChanged(before) {
      return !this.bmsVCurrent.some(bms => bms.id === before.id)
    },
    isRightChanged(current, before) {
      for (const bms of this.bmsVCurrent) {
        if (bms.id === current.id) {
          // moved left
          return false
        }
        if (bms.id === before.id) {
          // moved right
          return true
        }
      }
      throw new Error('unreachable')
    },
    animateArrow(isRight) {
      let arrow = '#arrow-left'
      let x = -5
      if (isRight) {
        arrow = '#arrow-right'
        x = 5
      }

      this.tl = gsap.timeline({paused: true});
      this.tl.to(arrow, {
        duration: 0.1,
        x: x,
        borderColor: 'rgba(255,255,255, 1)',
        scale: 1.2,
        ease: 'power2.inOut'
      });
      this.tl.to(arrow, {
        duration: 0.1,
        x: 0,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        scale: 1.2,
        ease: 'power2.inOut'
      });
      this.tl.play()
    },
    handleArrowShowing() {
      this.showLeft = true
      this.showRight = true
      if (this.bmsVCurrent[0].id === this.bmsCurrent.id) {
        // remove left
        this.showLeft = false
      }
      if (this.bmsVCurrent[this.bmsVCurrent.length - 1].id === this.bmsCurrent.id) {
        // remove right
        this.showRight = false
      }
    }
  },
  created() {
    window.addEventListener('keydown', this.keyboard)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyboard)
  }
}
</script>


<style scoped>
.music-select {

}

.current-bms {
  background-color: rgba(0, 0, 0, 0.3);
  overflow-y: hidden;
  -webkit-box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 0, 100% 100%, 25px 100%, 0 calc(100% - 25px), 0 0);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.center-bar {
  position: relative;
}

.record {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 50%;
  border: 12px solid transparent;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
  linear-gradient(to right, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.5) 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  position: relative;
}

.record img {
  object-fit: cover;
}

.h-10p {
  height: 12%;
}

.h-60p {
  height: 60%;
}

.h-30p {
  height: 28%;
}

.title {
  position: absolute;
}

.title b {
  color: #000000;
  /*text-shadow: 0 -40px 100px, 0 0 2px, 0 0 1em #ffffff, 0 0 0.5em #dedede, 0 0 0.1em #9d9d9d, 0 10px 3px #646464; */
  background: linear-gradient(to right, rgba(0, 0, 0, 0), whitesmoke, rgba(0, 0, 0, 0));
  width: 100%;
}

.arrow-right {
  height: 25px;
  width: 25px;
  border: 5px solid rgba(255, 255, 255, 0.5);
  border-width: 5px 5px 0 0;
  transform: rotate(45deg);
}

.arrow-left {
  height: 25px;
  width: 25px;
  border: 5px solid rgba(255, 255, 255, 0.5);
  border-width: 5px 5px 0 0;
  transform: rotate(225deg);
}
</style>