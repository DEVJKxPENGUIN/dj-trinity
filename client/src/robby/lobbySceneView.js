import {
  BufferGeometry, DoubleSide, Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PointsMaterial
} from "three";

export default class LobbySceneView {

  constructor(manager) {
    this.manager = manager
  }

  init = () => {
    const commonResources = this.manager.context.commonResources

    // my profile
    const profileBarG = new PlaneGeometry(400, 2)
    const profileBarM = new MeshBasicMaterial({
      color:0xdddddd, side:DoubleSide
    })
    this.profileBar = new Mesh(profileBarG, profileBarM)
    this.profileBar.position.set(-680, 350, 0)


  }

  clearCanvas = () => {
    this.manager.context.scene.remove(this.profileBar)

  }

  drawChatRoom = () => {
    this.manager.context.scene.add(this.profileBar)


  }

  destroy = () => {

  }
}