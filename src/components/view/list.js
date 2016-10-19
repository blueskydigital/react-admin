import React from 'react'
import { browserHistory } from 'react-router'


export default class ListViewBase extends React.Component {

  componentDidMount() {
    const { entityName, state, location, perPage } = this.props
    const { page, sortField, sortDir } = location.query
    let filterVals = undefined
    if(location.query.filters) {
      try {
        filterVals = JSON.parse(location.query.filters)
      } catch(err) {
        filterVals = {}
      }
    }
    state.loadListData(entityName, perPage || 10, page, sortField, sortDir, filterVals)
  }

  componentWillReceiveProps(nextProps) {
    const { state, location } = this.props
    const { page, sortField, sortDir, filters } = location.query

    if(nextProps.location.query.page !== page) {
      state.updatePage(nextProps.location.query.page)
    } else if(nextProps.location.query.sortField !== sortField || nextProps.location.query.sortDir !== sortDir) {
      state.updateSort(nextProps.location.query.sortField, nextProps.location.query.sortDir)
    } else if(nextProps.location.query.filters !== filters) {
      const newFilters = nextProps.location.query.filters
      try {
        const filterVals = newFilters ? JSON.parse(newFilters) : {}
        state.resetFilters(filterVals)
      } catch(err) {

      }
    }
  }

  showFilter(filter) {
    this.props.state.showFilter(filter)
    this._setFilterQuery()
  }

  hideFilter(filter) {
    this.props.state.hideFilter(filter)
    this._setFilterQuery()
  }

  applyFilters() {
    this.props.state.applyFilters()
    this._setFilterQuery()
  }

  _setFilterQuery() {
    const currFilters = this.props.state.filters
    if(currFilters.size === 0) {
      return this._changeQuery({filters: null})
    } else {
      this._changeQuery({filters: currFilters})
    }
  }

  onListSort(field, dir) {
    this._changeQuery({sortDir: dir, sortField: field})
  }

  _changeQuery(newquery) {
    let query = Object.assign({}, this.props.location.query || {})
    for(let k in newquery) {
      if(newquery[k] === null) { // removal
        delete query[k]
      } else {
        query[k] = newquery[k] // adding
      }
    }
    const serialized = Object.keys(query).reduce( (a,k) => {
      const val = typeof query[k] === 'object' ?
        JSON.stringify(query[k]) : encodeURIComponent(query[k])
      a.push(k + '=' + val)
      return a
    }, []).join('&')

    // TODO: use https://github.com/reactjs/react-router/blob/master/docs/API.md#createpathpathorloc-query
    browserHistory.push(`${this.props.location.pathname}?${serialized}`)
  }

  onPageChange(page) {
    this._changeQuery({page: page})
  }

  onSelect(data) {
    this.props.state.updateSelection(data)
  }

}
