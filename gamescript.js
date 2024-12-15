

// game.json 을 먼저 부른다.
const fs = require('fs');
const json = require('./client/src/options/ui/game.json');

const blockWidth = 55
const blockHeight = 55

// game.json 의 특정 부분을 순회하며 원하는 값을 수정한다.
json.key_7.gear.backboard.x = -1 * blockWidth * 4
json.key_7.gear.backboard.width = blockWidth * 8

json.key_7.gear.outline.x = -1 * blockWidth * 4
json.key_7.gear.outline.width = blockWidth * 8

json.key_7.gear.bar.x = -1 * blockWidth * 4
json.key_7.gear.bar.width = blockWidth * 8

json.key_7.gear.judgeLine.x = -1 * blockWidth * 4
json.key_7.gear.judgeLine.width = blockWidth * 8
json.key_7.gear.judgeLine.height = blockHeight

json.key_7.ui.time.box.x = blockWidth * 4
json.key_7.ui.time.text.x = blockWidth * 4 + 10

json.key_7.ui.bpm.box.x = blockWidth * 4
json.key_7.ui.bpm.text.x = blockWidth * 4 + 10

for(let i = 0; i <= 7; i++) {
  let key = 'key' + i
  if(i === 0) {
    key = 'scratch'
  }

  // block
  json.key_7.gear[key].block.x = -1 * blockWidth * 4 + blockWidth * (i + 1) - blockWidth / 2
  json.key_7.gear[key].block.width = blockWidth
  json.key_7.gear[key].block.height = blockHeight

  // pressEffect
  json.key_7.gear[key].pressEffect.x = -1 * blockWidth * 4 + blockWidth * (i)
  json.key_7.gear[key].pressEffect.width = blockWidth

  // hitEffect
  json.key_7.gear[key].hitEffect.x = -1 * blockWidth * 4 + blockWidth * (i) + blockWidth / 2
  json.key_7.gear[key].hitEffect.width = blockWidth * 2
  json.key_7.gear[key].hitEffect.height = blockWidth * 2
}

// 수정된 값을 game.json 에 저장한다.
fs.writeFileSync('./client/src/options/ui/game.json', JSON.stringify(json, null, 2), 'utf-8');

