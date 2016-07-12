import {observable, computed, autorun, action, transaction} from 'mobx';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import BaseStore from './Base';


export default class EntityStore extends BaseStore {

  _actions = {
    'show': ['list', 'edit', 'delete']
  }

  @observable panels = [];
  @observable originEntityId = null;
  @observable entityName = null;
  @observable values = {};
  @observable dataStore = null;
  @observable totalItems = 0;
  @observable page = 1;
  @observable sortDir = null;
  @observable sortField = null;
  @observable filters = null;
  @observable selected = [];
  @observable resourceNotFound = false;
  @observable loading = false;
  @observable view = null;

  @computed get viewActions() {
    return this.view.actions() || ['create', 'list'];
  }

  @computed get unselectedFilters() {
    return {}
  }

  // @action
  // loadDashboardPanels(restful, configuration, sortField, sortDir) {
  //
  // }

  @action
  updatePage(page) {
    this.loading = true;
    return this.requester.getEntries(new DataStore(), this.view, page, {
      references: true,
      choices: true,
      sortField: this.sortField,
      sortDir: this.sortDir,
      filters: this.filters
    }).then((collection) => {
      transaction(() => {
        this.page = page;
        this.dataStore = collection.dataStore;
        this.loading = false;
      });
    });
  }

  @action
  updateSort(sortField, sortDir) {
    this.loading = true;
    return this.requester.getEntries(new DataStore(), this.view, this.page, {
      references: true,
      choices: true,
      sortField: sortField,
      sortDir: sortDir,
      filters: this.filters
    }).then((collection) => {
      transaction(() => {
        this.sortField = sortField;
        this.sortDir = sortDir;
        this.dataStore = collection.dataStore;
        this.loading = false;
      });
    });
  }

  @action
  loadListData(entityName, page = 1, sortField = null, sortDir = null, filters = null) {
    let view = this.getView(entityName, 'ListView');
    this.loading = true;

    return this.requester.getEntries(new DataStore(), view, page, {
      references: true,
      choices: true,
      sortField,
      sortDir,
      filters
    }).then((collection) => {
      transaction(() => {
        this.entityName = entityName;
        this.view = view;
        this.page = page;
        this.sortField = sortField;
        this.sortDir = sortDir;
        this.filters = filters;
        this.totalItems = collection.totalItems;
        this.dataStore = collection.dataStore;
        this.loading = false;
      });
    });

  }

  @action
  loadShowData(entityName, id, sortField, sortDir) {
    let view = this.getView(entityName, 'ShowView');
    this.loading = true;

    return this.requester.getEntry(view, id, {
      references: true, referencesList: true, sortField, sortDir
    }).then((dataStore) => {
      transaction(() => {
        this.loading = false;
        this.view = view;
        this.dataStore = dataStore;
      });
    });
  }

  @action
  loadEditData(entityName, id, sortField, sortDir) {
    let view = this.getView(entityName, 'EditView');
    this.loading = true;

    return this.requester.getEntry(view, id, {
      references: true, referencesList: true, sortField, sortDir
    }).then((dataStore) => {
      transaction(() => {
        this.originEntityId = id;
        this.dataStore = dataStore;
        this.view = view;
        let entry = dataStore.getFirstEntry(view.entity.uniqueId);
        for (let fieldName in entry.values) {
          this.values[fieldName] = entry.values[fieldName];
        }
        this.loading = false;
      });
    });
  }

  @action
  loadCreateData(entityName) {
    let view = this.getView(entityName, 'CreateView');

    this.requester.createEntry(view)
    .then((dataStore) => {
      transaction(() => {
        this.originEntityId = null;
        this.view = view;
        this.dataStore = dataStore;
        let entry = dataStore.getFirstEntry(view.entity.uniqueId);
        for (let fieldName in entry.values) {
          const field = entry.values[fieldName];
          this.values[field.name()] = field.defaultValue();
        }
      });
    });
  }

  @action
  loadDeleteData(entityName, id) {
    let view = this.getView(entityName, 'DeleteView');
    this.loading = true;

    return this.requester.getEntry(view, id, {
      references: true, referencesList: false, choices: false
    }).then((dataStore) => {
      this.originEntityId = id;
      this.view = view;
      this.dataStore = dataStore;
      this.loading = false;
    });
  }

  // called on each update of edit form. Validation performed here?
  @action
  updateData(fieldName, value, choiceFields=[]) {
    this.values[fieldName] = value;

    // Handle related values between choice fields
    if (choiceFields.length) {
        choiceFields.map((field) => {
            if (fieldName === field.name()) {
                return;
            }

            let choices = field.choices();
            if ('function' === typeof choices) {
                choices = choices({ values: this.values });
            }

            let valueInChoices = false;
            choices.map((v) => {
                if (v.value === this.values[field.name()]) {
                    valueInChoices = true;
                }
            });

            if (!valueInChoices) {
                this.values[field.name()] = null;
            }
        });
    }
  }

  @action
  saveData() {
    this.loading = true;
    const id = this.originEntityId;

    let rawEntry = {};
    for (let name in this.values) {
        rawEntry[name] = this.values[name];
    }

    return this.requester
      .saveEntry(this.dataStore, this.view, rawEntry, id)
      .then((dataStore) => {
        transaction(() => {
          this.dataStore = dataStore;
          this.loading = false;
        });
        return dataStore;
      });
  }

  @action
  deleteData() {
    this.loading = true;
    const id = this.originEntityId;
    
    return this.requester.deleteEntry(this.view, id).then(() => {
      this.loading = false;
    });
  }


}
