import {observable, computed, autorun, action, transaction} from 'mobx'
import BaseState from './base'

export default class DataManipState extends BaseState {

  @observable originEntityId = null
  @observable entityName = null
  @observable entity = {}

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

}
