import {DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry} from "three";
import {TextGeometry} from "three/addons";

export default class LobbySceneView {

  constructor(manager) {
    this.manager = manager
    this.info = this.manager.context.info
  }

  init = () => {
    const commonResources = this.manager.context.commonResources

    // my profile
    this.profile = new Group()
    const profileBarG = new PlaneGeometry(400, 2)
    const profileBarM = new MeshBasicMaterial({
      color: 0xdddddd, side: DoubleSide
    })
    this.profileBar = new Mesh(profileBarG, profileBarM)
    this.profileBar.position.set(0, 0, 0)
    const profileIdG = new TextGeometry(`[  ${this.info.user.id}  ]`, {
      font: commonResources.fonts["font/Orbitron_Regular.json"],
      size: 20,
    })
    profileIdG.computeBoundingBox()
    this.profileId = new Mesh(profileIdG, new MeshBasicMaterial({
      color: 0xffffff
    }))
    this.profileId.position.set(-100, 10, 0)
    this.profileId.scale.set(1, 0.8, 1)
    const profileNicknameG = new TextGeometry(`${this.info.user.nickname}`, {
      font: commonResources.fonts["font/Orbitron_Regular.json"],
      size: 35,
    })
    profileNicknameG.computeBoundingBox()
    this.profileNickname = new Mesh(profileNicknameG, new MeshBasicMaterial({
      color: 0xffffff
    }))
    this.profileNickname.position.set(-100, 40, 0)
    this.profileNickname.scale.set(0.65, 1, 1)

    const channelIdG = new TextGeometry(`# ${this.info.channel.id}`, {
      font: commonResources.fonts["font/Orbitron_Regular.json"],
      size: 20,
    })
    channelIdG.computeBoundingBox()
    this.channelId = new Mesh(channelIdG, new MeshBasicMaterial({
      color: 0xffffff
    }))
    this.channelId.position.set(-195, 100, 0)
    this.channelId.scale.set(1, 0.8, 1)
    const profileImageG = new PlaneGeometry(80, 80)
    console.log(this.manager.resources.textures[this.info.user.profile])
    const profileImageM = new MeshBasicMaterial({
      map: this.manager.resources.textures[this.info.user.profile]
    })
    this.profileImage = new Mesh(profileImageG, profileImageM)
    this.profileImage.position.set(-155, 50, 0)

    this.profile.add(this.profileBar)
    this.profile.add(this.profileId)
    this.profile.add(this.profileNickname)
    this.profile.add(this.profileImage)
    this.profile.add(this.channelId)
    this.profile.position.set(-680, 370, 0)

    // channel with users
    // this.channel = new Group()
    // const channelIdG = new TextGeometry(`[  ${this.info.channel.id}  ]`, {

  }

  clearCanvas = () => {
    this.manager.context.scene.remove(this.profile)

  }

  drawChatRoom = () => {
    this.manager.context.scene.add(this.profile)

  }

  updateTextGeometries = () => {
    const commonResources = this.manager.context.commonResources
    if (this.channelId.geometry) {
      this.channelId.geometry.dispose()
      this.channelId.geometry = new TextGeometry(`# ${this.info.channel.id}`, {
        font: commonResources.fonts["font/Orbitron_Regular.json"],
        size: 20,
      })
    }


  }

  destroy = () => {

  }
}