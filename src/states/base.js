import { observable, action } from 'mobx'

export default class BaseState {

  constructor(requester) {
    this.requester = requester
  }

  @observable reqCount = 0

  @computed get loading() {
    this.reqCount > 0
  }

}
