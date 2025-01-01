import AppManager from "@/manager/AppManager";

export default interface Socket {
  socket: WebSocket | undefined

  init(ctx: AppManager): Promise<void>

  destroy(): void
}