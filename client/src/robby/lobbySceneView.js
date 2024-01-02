import {Group, Mesh, MeshBasicMaterial, PlaneGeometry} from "three";
import {TextGeometry} from "three/addons";
import vs from "./lobbySceneViewSettings.json";

export default class LobbySceneView {

  constructor(manager) {
    this.manager = manager
    this.info = this.manager.context.info
  }

  init = () => {
    const commonResources = this.manager.context.commonResources

    // my profile
    this.profile = new Group()
    const profileIdG = new TextGeometry(`[  ${this.info.user.id}  ]`, {
      font: commonResources.fonts[vs.profile.profileId.font],
      size: vs.profile.profileId.size,
    })
    this.profileId = new Mesh(profileIdG, new MeshBasicMaterial({
      color: vs.profile.profileId.color
    }))
    this.profileId.position.set(vs.profile.profileId.x, vs.profile.profileId.y)
    const profileNicknameG = new TextGeometry(`${this.info.user.nickname}`, {
      font: commonResources.fonts[vs.profile.profileNickname.font],
      size: vs.profile.profileNickname.size,
    })
    this.profileNickname = new Mesh(profileNicknameG, new MeshBasicMaterial({
      color: vs.profile.profileNickname.color
    }))
    this.profileNickname.position.set(vs.profile.profileNickname.x,
        vs.profile.profileNickname.y)
    const profileImageG = new PlaneGeometry(vs.profile.profileImage.width,
        vs.profile.profileImage.height)
    console.log(this.manager.resources.textures[this.info.user.profile])
    const profileImageM = new MeshBasicMaterial({
      map: this.manager.resources.textures[this.info.user.profile]
    })
    this.profileImage = new Mesh(profileImageG, profileImageM)
    this.profileImage.position.set(vs.profile.profileImage.x,
        vs.profile.profileImage.y)
    this.profile.add(this.profileId)
    this.profile.add(this.profileNickname)
    this.profile.add(this.profileImage)
    this.profile.position.set(vs.profile.x, vs.profile.y)

    // current channel
    const channelIdG = new TextGeometry(`# ${this.info.channel.id}`, {
      font: commonResources.fonts[vs.channelId.font],
      size: vs.channelId.size,
    })
    this.channelId = new Mesh(channelIdG, new MeshBasicMaterial({
      color: vs.channelId.color
    }))
    this.channelId.position.set(vs.channelId.x, vs.channelId.y)

    // channel with users
    this.userProfiles = new Group()
    this.userProfileList = new Group()
    this.userProfileEmpty = new Mesh(
        new TextGeometry(vs.userProfileList.userProfileEmpty.text, {
          font: commonResources.fonts[vs.userProfileList.userProfileEmpty.font],
          size: vs.userProfileList.userProfileEmpty.size,
        }), new MeshBasicMaterial({
          color: vs.userProfileList.userProfileEmpty.color
        }))
    this.userProfileEmpty.position.set(vs.userProfileList.userProfileEmpty.x,
        vs.userProfileList.userProfileEmpty.y)
    const userProfileBoxG = new PlaneGeometry(
        vs.userProfileList.profileBox.width,
        vs.userProfileList.profileBox.height)
    this.userProfileBox = new Mesh(userProfileBoxG,
        new MeshBasicMaterial(vs.userProfileList.profileBox.material))
    this.userProfileBox.position.set(vs.userProfileList.profileBox.x,
        vs.userProfileList.profileBox.y, -1)
    this.userProfiles.add(this.userProfileList)
    this.userProfiles.add(this.userProfileEmpty)
    this.userProfiles.add(this.userProfileBox)
    this.userProfiles.position.set(vs.userProfileList.x, vs.userProfileList.y)

    // chat box
    this.chatBox = new Group()
    this.chatText = new Group()
    const chatListG = new PlaneGeometry(vs.chatBox.list.width, vs.chatBox.list.height)
    const chatListM = new MeshBasicMaterial(vs.chatBox.list.material)
    const chatList = new Mesh(chatListG, chatListM)
    chatList.position.set(vs.chatBox.list.x, vs.chatBox.list.y)
    this.chatText.position.set(vs.chatBox.text.x, vs.chatBox.text.y)
    this.chatBox.add(chatList)
    this.chatBox.add(this.chatText)
    this.chatBox.position.set(vs.chatBox.x, vs.chatBox.y, 0)


  }

  clearCanvas = () => {
    this.manager.context.scene.remove(this.profile)
    this.manager.context.scene.remove(this.userProfiles)
    this.manager.context.scene.remove(this.channelId)
    this.manager.context.scene.remove(this.chatBox)

  }

  drawChatRoom = () => {
    this.manager.context.scene.add(this.profile)
    this.manager.context.scene.add(this.userProfiles)
    this.manager.context.scene.add(this.channelId)
    this.manager.context.scene.add(this.chatBox)

    this.updateTextGeometries()
  }

  updateTextGeometries = () => {
    const commonResources = this.manager.context.commonResources
    // channel id
    this.channelId.geometry.dispose()
    this.channelId.geometry = new TextGeometry(`# ${this.info.channel.id}`, {
      font: commonResources.fonts["font/Tektur_Regular.json"],
      size: 15,
    })

    // users
    this.manager.context.removeGroup(this.userProfileList)
    this.userProfiles.remove(this.userProfileEmpty)
    for (let i = 0; i < this.manager.showUsers.length; i++) {
      const user = this.manager.showUsers[i]

      const userProfile = new Group()
      const profileIdG = new TextGeometry(`[  ${user.id}  ]`, {
        font: commonResources.fonts[vs.userProfileList.profileId.font],
        size: vs.userProfileList.profileId.size,
      })
      const profileId = new Mesh(profileIdG, new MeshBasicMaterial({
        color: vs.userProfileList.profileId.color
      }))
      profileId.position.set(vs.userProfileList.profileId.x,
          vs.userProfileList.profileId.y)
      const nickNameG = new TextGeometry(`${user.nickname}`, {
        font: commonResources.fonts[vs.userProfileList.profileNickname.font],
        size: vs.userProfileList.profileNickname.size,
      })
      const nickName = new Mesh(nickNameG, new MeshBasicMaterial({
        color: vs.userProfileList.profileNickname.color
      }))
      nickName.position.set(vs.userProfileList.profileNickname.x,
          vs.userProfileList.profileNickname.y)
      const imageG = new PlaneGeometry(vs.userProfileList.profileImage.width,
          vs.userProfileList.profileImage.height)
      const imageM = new MeshBasicMaterial({
        map: this.manager.resources.textures[user.profile]
      })
      const image = new Mesh(imageG, imageM)
      image.position.set(vs.userProfileList.profileImage.x,
          vs.userProfileList.profileImage.y)

      userProfile.add(profileId)
      userProfile.add(nickName)
      userProfile.add(image)
      userProfile.position.set(0,
          -i * vs.userProfileList.yOffset, 0)
      this.userProfileList.add(userProfile)
    }
    if (this.userProfileList.children.length === 0) {
      this.userProfiles.add(this.userProfileEmpty)
    }

    // chats
    this.manager.context.removeGroup(this.chatText)
    for(let i = 0; i < this.manager.showChats.length; i++) {
      const chat = this.manager.showChats[i]

      if(chat.chatType === "SYSTEM") {
        const chatG = new TextGeometry(`[SYSTEM : ${chat.sendTime.split('T')[1].split('.')[0]}] ${chat.message}`, {
          font : commonResources.fonts[vs.chatBox.text.font],
          size : vs.chatBox.text.size,
        })
        const chatObj = new Mesh(chatG, new MeshBasicMaterial({
          color : vs.chatBox.text.systemColor
        }))
        chatObj.position.set(0, -i * vs.chatBox.text.yOffset)
        this.chatText.add(chatObj)
        continue
      }

      if(chat.chatType === "NORMAL") {
        // todo -
      }

    }
  }

  destroy = () => {

  }
}