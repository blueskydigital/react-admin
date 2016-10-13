import {observable, computed, action, transaction, asMap, toJS} from 'mobx'
import DataManipState from './data_manip'

export default class DataTableState extends DataManipState {

  perPage = 2

  @observable entityName = null
  @observable items = []
  @observable totalItems = 0
  @observable page = 1
  @observable sortDir = null
  @observable sortField = null

  @action
  loadListData(entityName, page = 1, sortField = null, sortDir = null, filters = {}) {
    this.entityName = entityName
    this._getEntries(entityName, page, sortField, sortDir, filters)
  }

  @action
  updatePage(page) {
    this._getEntries(this.entityName, page, this.sortField, this.sortDir, toJS(this.filters))
  }

  @action
  updateSort(sortField, sortDir) {
    this._getEntries(this.entityName, this.page, sortField, sortDir, toJS(this.filters))
  }

  @action
  deleteData(data) {
    const id = this.originEntityId

    return this.callRequester(() => {
      return this.requester.deleteEntry(this.view, id)
    })
  }

  @action
  deleteSelected() {
    // TODO: dodelat this.callRequester(() =>{
  }

  // ---------------------- selection  ----------------------------

  @observable selection = []

  @action
  updateSelection(data) {
    this.selection.replace(data)
  }

  // ---------------------- filtration  ----------------------------

  @observable filters = asMap({})

  @action
  resetFilters(newFilters = {}) {
    transaction(() => {
      _resetFilters(newFilters)
    })
  }

  @action
  updateFilterValue(name, value) {
    this.filters.set(name, value)
  }

  @action
  applyFilters() {
    this._getEntries(this.entityName, this.page, this.sortField, this.sortDir, this.filters)
  }

  @action
  showFilter(filter) {
    this.filters.set(filter, undefined)
  }

  @action
  hideFilter(filter) {
    this.filters.delete(filter)
  }

  _resetFilters(newFilters) {
    this.filters.clear()
    for(let i in newFilters) {
      this.filters.set(i, newFilters[i])
    }
  }

  // ---------------------- privates, support ----------------------------

  _getEntries(entityName, page, sortField, sortDir, filters) {
    return this.callRequester(() => {
      return this.requester.getEntries(entityName, {
        page,
        sortField,
        sortDir,
        filters,
        perPage: this.perPage
      }).then((result) => {
        transaction(() => {
          this.page = page
          this.sortField = sortField
          this.sortDir = sortDir
          this._resetFilters(filters)
          this.totalItems = result.totalItems
          this.items.replace(result.data)
        })
      })
    })
  }

}
