const GAME_PREPARING = 'gamePreparing'
const GAME_READY = 'gameReady'
const GAME_PLAYING = 'gamePlaying'
const GAME_PAUSED = 'gamePaused'

class GameWorker {

  constructor() {
  }

  doProcess(bms) {
    this.header = bms.bmsHeader
    this.blocks = bms.bmsData
    this.initGame()
    this.initBms()
    this.updateBarTime()

    this.gameLoop()
  }

  async gameLoop() {
    const targetDelay = 1000 / this.targetFps
    let lastTime = performance.now()
    let lastFpsTime = lastTime
    let accumulator = 0
    let frameCount = 0

    while (true) {
      const currentTime = performance.now()
      const delta = currentTime - lastTime
      lastTime = currentTime
      accumulator += delta

      while (accumulator >= targetDelay) {
        this.update()
        postMessage(this)

        accumulator -= targetDelay // update 시 연산시간 제거

        // calculate fps
        frameCount++
        const elapsedTime = currentTime - lastFpsTime
        if (elapsedTime >= 1000) {
          this.fps = Math.round(frameCount / (elapsedTime / 1000))
          frameCount = 0
          lastFpsTime = currentTime
        }
      }

      // loop 제어권 반환
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  initGame() {
    // option
    this.initialTime = 2000
    this.elapsedTime = 0
    this.startTime = null;
    this.pauseTime = 0;
    this.targetFps = 300
    this.fps = 0
    this.state = GAME_READY

    // in-game
    this.speed = 0.4
    this.stop = 0
  }

  initBms() {
    this.startBpm = this.header.startBpm;
    this.bpm = this.header.startBpm;
    this.bars = []

    this.bars = this.blocks.reduce((acc, cur) => {
      if (acc[cur['bar']]) {
        acc[cur['bar']].push(cur);
        return acc;
      }
      acc[cur['bar']] = [cur];
      return acc;
    }, []);

    for (let i = 0; i < this.bars.length; i++) {
      if (!this.bars[i]) {
        this.bars[i] = []
      }
    }
  }

  updateBarTime() {
    const elapsedTime = this.elapsedTime;

    let lastTime = this.initialTime;
    let lastPos = 0;
    let lastY = 0;
    let bpm = this.startBpm;
    let isFirstShow = true;
    for (let i = 0; i < this.bars.length; i++) {
      let barShorten = 1;

      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j];
        const bmsChannel = block['bmsChannel'];
        if (bmsChannel === 'BAR_SHORTEN') {
          barShorten = block['value'];
          continue;
        }
        block['time'] = lastTime + (block['position'] - lastPos) * (1 / bpm
            * 60000 * 4) * barShorten;
        if (block['time'] > elapsedTime) {
          let time;
          if (isFirstShow) {
            time = elapsedTime;
            isFirstShow = false;
          } else {
            time = lastTime;
          }

          if (this.stop < block['time']) {
            block['y'] = lastY + (block['time'] - Math.max(time, this.stop))
                * bpm * 0.005
                * this.speed;
            lastY = block['y']
          }
        }

        lastTime = block['time'];
        lastPos = block['position'];

        if (bmsChannel === 'BPM') {
          bpm = block['value'];
        } else if (bmsChannel === 'BPM_EXTENDED') {
          bpm = this.header.bpm[block['value']];
        } else if (bmsChannel === 'SEQUENCE_STOP') {
          if (this.header.stop[block['value']]) {
            const stopTime = this.header.stop[block['value']]
                * 0.005208 // / 192
                / bpm * 60000 * 4;
            block['stop'] = stopTime;
            lastTime += stopTime;
          }
        }
      }

      this.bars[i]['time'] = lastTime + (1 - lastPos) * barShorten * (60000
          / bpm) * 4;
      if (this.bars[i]['time'] > elapsedTime) {
        let time;
        if (isFirstShow) {
          time = elapsedTime;
          isFirstShow = false;
        } else {
          time = lastTime;
        }

        this.bars[i]['y'] = lastY + (this.bars[i]['time'] - time) * bpm
            * 0.005
            * this.speed;
        lastY = this.bars[i]['y'];
      }
      lastTime = this.bars[i]['time'];
      lastPos = 0;
    }
  }

  handleGameState(state) {
    console.log(state)

    // at first playing, record start time
    if (this.state === GAME_READY && state === GAME_PLAYING) {
      this.startTime = performance.now()
    }
    this.state = state
  }

  // called in gameLoop
  update() {
    const now = performance.now()
    this.updateTimeAndFps(now)
    this.updateBarTime()

  }

  updateTimeAndFps(now) {
    if (!this.startTime) {
      this.startTime = 0;
    }
    if (this.state === GAME_READY) {
      return;
    }
    if (this.state === GAME_PAUSED) {
      this.pauseTime = now - this.elapsedTime - this.startTime;
    }
    this.elapsedTime = now - this.startTime - this.pauseTime;
  }
}

let _worker;
onmessage = (e) => {
  const command = e.data.command
  const data = e.data.body

  if (command === 'switchLoadingToGame') {
    _worker = new GameWorker()
    _worker.doProcess(data) // data should be vue
    return
  }

  if (command === 'handleGameState') {
    _worker.handleGameState(data)
    return
  }
}