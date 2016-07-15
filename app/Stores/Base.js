import {observable, computed, autorun, action, transaction} from 'mobx';
import DataStore from 'admin-config/lib/DataStore/DataStore';

export default class BaseStore {

  setConfigAndRequester(config, requester) {
    this.config = config;
    this.requester = requester;
  }

  hasEntityAndView(entityName) {
    try {
      const view = this.getView(entityName);

      if (!view.enabled) {
        if (console) {
          console.error(`The ${this.viewName} is disabled for "${entityName}" entity.`);
        }

        return false;
      }

      return true;
    } catch (e) {
      if (console) {
        console.error(e);
      }

      return false;
    }
  }

  getView(entityName, viewName) {
    const entity = this.config.getEntity(entityName);

    if (!entity.views.hasOwnProperty(viewName)) {
      throw new Error(`The ${viewName} does not exists.`);
    }

    return entity.views[viewName];
  }

}
