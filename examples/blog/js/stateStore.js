import {observable, computed, toJS, action, transaction} from 'mobx';
import EntityStore from '../../../app/Stores/EntityStore';


export default class StateStore extends EntityStore {

  @observable loggedUser = null;

  @action
  login(credentials) {
    let self = this;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        self.loggedUser = {
          uname: credentials.uname,
          name: 'gandalf the gray'
        }
        resolve(toJS(self.loggedUser));
      }, Math.random() * 2000 + 1000);
    });
  }

}
