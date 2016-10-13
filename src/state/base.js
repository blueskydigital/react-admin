import { observable, action, computed } from 'mobx'

export default class BaseState {

  constructor(requester) {
    this.requester = requester
  }

  @observable reqCount = 0

  @computed get loading() {
    this.reqCount > 0
  }

  callRequester(fn) {
    this.reqCount++
    return fn().then(() => {
      this.reqCount--
    })
  }

}
