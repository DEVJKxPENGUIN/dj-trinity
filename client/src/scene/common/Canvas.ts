import AppManager from "@/manager/AppManager";
import {ComponentPublicInstance} from "vue";

export default interface Canvas {
  vue: ComponentPublicInstance
  ctx: AppManager | undefined

  init(ctx: AppManager): Promise<void>
  update(): void

  destroy(): void
}