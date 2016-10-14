import { observable, action, computed } from 'mobx'

export default class BaseState {

  constructor(requester) {
    this.requester = requester
  }

  @observable req = {count: 0}

  @computed get loading() {
    return this.req.count > 0
  }

  @action
  incRecCount() {
    this.req.count++
  }

  @action
  decRecCount() {
    this.req.count--
  }

  callRequester(fn) {
    this.req.count++
    return fn()
    .then(() => {
      this.req.count--
    })
    .catch((err) => {
      this.req.count--
      alert(err)
    })
  }

}
