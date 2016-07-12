import {observable, computed, autorun, action, transaction} from 'mobx';
import DataStore from 'admin-config/lib/DataStore/DataStore';

export default class EntityStore {

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

  _view = null;

  constructor(requester) {
    this.requester = requester;
  }

  // @action
  // loadDashboardPanels(restful, configuration, sortField, sortDir) {
  //
  // }

  @action
  updatePage(page) {
    this.loading = true;
    return this.requester.getEntries(new DataStore(), this._view, page, {
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
    return this.requester.getEntries(new DataStore(), this._view, this.page, {
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
  loadListData(view, page = 1, sortField = null, sortDir = null, filters = null) {
    this.loading = true;
    this._view = view;

    return this.requester.getEntries(new DataStore(), view, page, {
      references: true,
      choices: true,
      sortField,
      sortDir,
      filters
    }).then((collection) => {
      transaction(() => {
        this.entityName = view.entity.name();
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
  loadShowData(view, id, sortField, sortDir) {
    this.loading = true;

    return this.requester.getEntry(view, id, {
      references: true, referencesList: true, sortField, sortDir
    }).then((dataStore) => {
      transaction(() => {
        this.loading = false;
        this.dataStore = dataStore;
      });
    });
  }

  @action
  loadEditData(view, id, sortField, sortDir) {
    this.loading = true;

    return this.requester.getEntry(view, id, {
      references: true, referencesList: true, sortField, sortDir
    }).then((dataStore) => {
      transaction(() => {
        this.originEntityId = id;
        this.dataStore = dataStore;
        let entry = dataStore.getFirstEntry(view.entity.uniqueId);
        for (let fieldName in entry.values) {
          this.values[fieldName] = entry.values[fieldName];
        }
        this.loading = false;
      });
    });
  }

  @action
  loadCreateData(view) {
    this.requester.createEntry(view)
    .then((dataStore) => {
      transaction(() => {
        this.originEntityId = null;
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
  loadDeleteData(view, id) {
    this.loading = true;

    return this.requester.getEntry(view, id, {
      references: true, referencesList: false, choices: false
    }).then((dataStore) => {
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
  saveData(view) {
    this.loading = true;
    const id = this.originEntityId;

    let rawEntry = {};
    for (let name in this.values) {
        rawEntry[name] = this.values[name];
    }

    return this.requester
      .saveEntry(this.dataStore, view, rawEntry, id)
      .then((dataStore) => {
        transaction(() => {
          this.dataStore = dataStore;
          this.loading = false;
        });
        return dataStore;
      });
  }

  @action
  deleteData(view, id) {
    this.loading = true;
    return this.requester.deleteEntry(view, id).then(() => {
      this.loading = false;
    });
  }
}
