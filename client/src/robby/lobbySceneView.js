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
    this.userProfiles = new Group()
    this.userProfileList = new Group()
    this.userProfileList.scale.set(1, 0.4, 1)
    const userProfileBarG = new PlaneGeometry(400, 2)
    this.userProfileBar = new Mesh(userProfileBarG, profileBarM)
    this.userProfileBar.position.set(0, -460, 0)
    this.userProfileEmpty = new Mesh(
        new TextGeometry('No User in this channel', {
          font: commonResources.fonts["font/Orbitron_Regular.json"],
          size: 15,
        }), new MeshBasicMaterial({
          color: 0x666666
        }))
    this.userProfileEmpty.position.set(-130, -200, 0)

    this.userProfiles.add(this.userProfileList)
    this.userProfiles.add(this.userProfileBar)
    this.userProfiles.add(this.userProfileEmpty)
    this.userProfiles.position.set(-680, 300, 0)
  }

  clearCanvas = () => {
    this.manager.context.scene.remove(this.profile)
    this.manager.context.scene.remove(this.userProfiles)

  }

  drawChatRoom = () => {
    this.manager.context.scene.add(this.profile)
    this.manager.context.scene.add(this.userProfiles)

    this.updateTextGeometries()
  }

  updateTextGeometries = () => {
    const commonResources = this.manager.context.commonResources
    // channel id
    this.channelId.geometry.dispose()
    this.channelId.geometry = new TextGeometry(`# ${this.info.channel.id}`, {
      font: commonResources.fonts["font/Orbitron_Regular.json"],
      size: 20,
    })

    // users
    this.manager.context.removeGroup(this.userProfileList)
    this.userProfiles.remove(this.userProfileEmpty)
    for (let i = 0; i < this.manager.showUsers.length; i++) {
      const user = this.manager.showUsers[i]

      const userProfile = new Group()
      const profileIdG = new TextGeometry(`[  ${user.id}  ]`, {
        font: commonResources.fonts["font/Orbitron_Regular.json"],
        size: 20,
      })
      profileIdG.computeBoundingBox()
      const profile = new Mesh(profileIdG, new MeshBasicMaterial({
        color: 0xffffff
      }))
      profile.position.set(-100, 10, 0)
      profile.scale.set(1, 0.8, 1)
      const nickNameG = new TextGeometry(`${user.nickname}`, {
        font: commonResources.fonts["font/Orbitron_Regular.json"],
        size: 35,
      })
      nickNameG.computeBoundingBox()
      const nickName = new Mesh(nickNameG, new MeshBasicMaterial({
        color: 0xffffff
      }))
      nickName.position.set(-100, 40, 0)
      nickName.scale.set(0.65, 1, 1)
      const imageG = new PlaneGeometry(80, 80)
      const imageM = new MeshBasicMaterial({
        map: this.manager.resources.textures[user.profile]
      })
      const image = new Mesh(imageG, imageM)
      image.position.set(-155, 50, 0)

      userProfile.add(profile)
      userProfile.add(nickName)
      userProfile.add(image)
      userProfile.position.set(0, -i * 120, 0)
      this.userProfileList.add(userProfile)
    }
    if (this.userProfileList.children.length === 0) {
      this.userProfiles.add(this.userProfileEmpty)
    }
  }

  destroy = () => {

  }
}