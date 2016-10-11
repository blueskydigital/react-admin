import {observable, computed, action, transaction} from 'mobx'

export default class DataTableState {

  perPage = 2

  @observable entityName = null
  @observable items = []
  @observable totalItems = 0
  @observable page = 1
  @observable sortDir = null
  @observable sortField = null

  @action
  loadListData(entityName, page = 1, sortField = null, sortDir = null, filters = {}) {
    transaction(() => {
      this.entityName = entityName
      this.loading = true
    })
    this._getEntries(entityName, page, sortField, sortDir, filters)
  }

  @action
  updatePage(page) {
    this.loading = true
    this._getEntries(this.entityName, page, this.sortField, this.sortDir, this.filters)
  }

  @action
  updateSort(sortField, sortDir) {
    this.loading = true
    this._getEntries(this.entityName, this.page, sortField, sortDir, this.filters)
  }

  @action
  deleteData(data) {
    this.loading = true
    const id = this.originEntityId

    return this.requester.deleteEntry(this.view, id).then(() => {
      this.loading = false
    })
  }

  @action
  deleteSelected() {
    this.loading = true
    // TODO: dodelat
  }

  // ---------------------- selection  ----------------------------

  @observable selection = []

  @action
  updateSelection(data) {
    this.selection.replace(data)
  }

  // ---------------------- filtration  ----------------------------

  @observable filters = {}

  @action
  updateFilterValue(name, value) {
    this.filters[name] = value
  }

  @action
  applyFilters() {
    this.loading = true
    this._getEntries(this.entityName, this.page, this.sortField, this.sortDir, this.filters)
  }

  @action
  showFilter(filter) {
    this.filters[filter] = undefined
  }

  @action
  hideFilter(filter) {
    delete this.filters[filter]
  }

  // ---------------------- privates, support ----------------------------

  _getEntries(entityName, page, sortField, sortDir, filters) {
    return this.requester.getEntries(entityName, {
      page,
      sortField,
      sortDir,
      filters
    }).then((result) => {
      transaction(() => {
        this.page = page
        this.sortField = sortField
        this.sortDir = sortDir
        this.filters = filters
        this.totalItems = result.totalItems
        this.items.replace(result.data)
        this.loading = false
      })
    })
  }

}
