import {observable, computed, toJS, action, transaction} from 'mobx'
import DataTableState from 'react-mobx-admin/state/data_table'


export default class StateStore extends DataTableState {

  @observable loggedUser = null;

  @action
  login(credentials) {
    let self = this
    this.incRecCount()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        self.loggedUser = {
          uname: credentials.uname,
          name: 'gandalf the gray'
        }
        this.decRecCount()
        resolve(toJS(self.loggedUser))
      }, Math.random() * 2000 + 1000)
    })
  }

}
