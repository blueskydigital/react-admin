import {observable, computed, autorun, action, transaction} from 'mobx';
import DataStore from 'admin-config/lib/DataStore/DataStore';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';

import BaseStore from './Base';


export default class EntityStore extends BaseStore {

  _actions = {
    'ListView': ['filters', 'create'],
    'EditView': ['list', 'delete'],
    'ShowView': ['list', 'edit', 'delete'],
    'DeleteView': ['back']
  }

  @observable panels = [];
  @observable originEntityId = null;
  @observable entityName = null;
  @observable values = {};
  @observable dataStore = new DataStore();
  @observable totalItems = 0;
  @observable page = 1;
  @observable sortDir = null;
  @observable sortField = null;
  @observable visibleFilters = [];
  @observable filterValues = {};
  @observable resourceNotFound = false;
  @observable loading = false;
  @observable view = null;

  @computed get viewActions() {
    return this.view.actions() || this._actions[this.view.type];
  }

  @computed get unselectedFilters() {
    return (this.view && this.view.filters) ? this.view.filters() : [];
  }

  @action
  showFilter(filter) {
    this.visibleFilters.push(filter);
  }

  @action
  updateFilters(newFilters) {
    transaction(() => {
      // check if visible need to hide
      this.visibleFilters.filter((f) => ! (f.name() in newFilters))
        .forEach((i) => this.visibleFilters.remove(i));
      this.loading = true;
    });
    // update data
    return this.requester.getEntries(new DataStore(), this.view, this.page, {
      references: true,
      choices: true,
      sortField: this.sortField,
      sortDir: this.sortDir,
      filters: newFilters
    }).then((collection) => {
      transaction(() => {
        this.filters = newFilters;
        this.dataStore = collection.dataStore;
        this.loading = false;
      });
    });
  }

  @action
  loadDashboardPanels(sortField, sortDir) {
    const dashboardViews = this.config.getViewsOfType('DashboardView');
    let panels = [];
    let dataStore = new DataStore();
    let promises = [];

    this.loading = true;

    let i,
        view,
        entity,
        dashboardSortField,
        dashboardSortDir;

    for (i in dashboardViews) {
        view = dashboardViews[i];
        entity = view.entity;
        dashboardSortField = null;
        dashboardSortDir = null;

        if (sortField && sortField.split('.')[0] === view.name()) {
            dashboardSortField = sortField;
            dashboardSortDir = sortDir;
        }

        panels.push({
            label: view.title() || entity.label(),
            view: view,
            entity: entity,
            sortDir: view.sortDir(),
            sortField: view.sortField()
        });

        promises.push(this.requester.getEntries(dataStore, view, 1, {
            references: true,
            sortField: dashboardSortField,
            sortDir: dashboardSortDir
        }));
    }

    PromisesResolver.allEvenFailed(promises).then((responses) => {
      if (0 === responses.length) {
          return;
      }

      transaction(() => {
        this.panels = panels;
        this.dataStore = dataStore;
        this.loading = false;
        this.sortField = sortField;
        this.sortDir = sortDir;
      });
    }).catch(this.throwPromiseError);
  }

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
    transaction(() => {
      this.view = this.getView(entityName, 'ListView');
      this.loading = true;
    });

    return this.requester.getEntries(new DataStore(), this.view, page, {
      references: true,
      choices: true,
      sortField,
      sortDir,
      filters
    }).then((collection) => {
      transaction(() => {
        this.entityName = entityName;
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
    transaction(() => {
      this.view = this.getView(entityName, 'ShowView');
      this.loading = true;
    });

    return this.requester.getEntry(this.view, id, {
      references: true, referencesList: true, sortField, sortDir
    }).then((dataStore) => {
      transaction(() => {
        this.loading = false;
        this.dataStore = dataStore;
      });
    });
  }

  @action
  loadEditData(entityName, id, sortField, sortDir) {
    transaction(() => {
      this.view = this.getView(entityName, 'EditView');
      this.loading = true;
    });

    return this.requester.getEntry(this.view, id, {
      references: true, referencesList: true, choices: true, sortField, sortDir
    }).then((dataStore) => {
      transaction(() => {
        this.originEntityId = id;
        this.dataStore = dataStore;
        let entry = dataStore.getFirstEntry(this.view.entity.uniqueId);
        for (let fieldName in entry.values) {
          this.values[fieldName] = entry.values[fieldName];
        }
        this.loading = false;
      });
    });
  }

  @action
  loadCreateData(entityName) {
    transaction(() => {
      this.view = this.getView(entityName, 'CreateView');
      this.requester.createEntry(this.view).then((dataStore) => {
        this.originEntityId = null;
        this.dataStore = dataStore;
        let entry = dataStore.getFirstEntry(this.view.entity.uniqueId);
        for (let fieldName in entry.values) {
          const field = entry.values[fieldName];
          this.values[field.name()] = field.defaultValue();
        }
      });
    });
  }

  @action
  loadDeleteData(entityName, id) {
    transaction(() => {
      this.view = this.getView(entityName, 'DeleteView');
      this.loading = true;
    });

    return this.requester.getEntry(this.view, id, {
      references: true, referencesList: false, choices: false
    }).then((dataStore) => {
      transaction(() => {
        this.originEntityId = id;
        this.dataStore = dataStore;
        this.loading = false;
      });
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
