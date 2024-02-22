import {Loader} from "three";
import {get} from "./serverHandler";

export default class BmsLoader extends Loader {

  constructor(manager) {
    super(manager);
  }

  load(url, onLoad, onProgress, onError) {

    const scope = this

    scope.manager.itemStart(url)
    get('/bms/list', {})
    .then((bmsList) => {
      if (onLoad) {
        onLoad(bmsList)
      }
      scope.manager.itemEnd(url)
    })
    .catch((err) => {
      console.log('bms load error occurred', err)
      scope.manager.itemError(url)
      scope.manager.itemEnd(url)
    })
  }

}