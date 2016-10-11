import React from 'react'
import { browserHistory } from 'react-router'

import Datagrid from '../components/datagrid/datagrid'
import Pagination from '../components/datagrid/pagination'
import DatagridActions from '../components/datagrid/actions'
import Filters from '../components/datagrid/filters'


class ListView extends React.Component {

  componentDidMount() {
    const { entityName, state, filters, location } = this.props
    const { page, sortField, sortDir } = location.query
    let filterVals = undefined
    if(filters && location.query.filters) {
      try {
        filterVals = JSON.parse(location.query.filters)
      } catch(err) {
        filterVals = {}
      }
    }
    state.loadListData(entityName, page, sortField, sortDir, filterVals)
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
        state.updateFilters(filterVals)
      } catch(err) {

      }
    }
  }

  showFilter(filter) {
    this.props.state.showFilter(filter)
  }

  hideFilter(filter) {
    this.props.state.hideFilter(filter)
    this.updateFilters()
  }

  updateFilters() {
    const currFilters = this.props.state.filters
    this.props.state.applyFilters()

    if (0 === Object.keys(currFilters).length) {
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

  render() {
    const {title, desc, fields, actions, filters} = this.props

    return (
      <div className="view list-view">
        <div className="page-header">
          <div style={{float: 'right'}}>
            {actions ? (<DatagridActions state={this.props.state} actions={actions} />) : null}
          </div>
          <div style={{float: 'right'}}>
            {filters ? (<Filters.Dropdown state={this.props.state} filters={filters} showFilter={this.showFilter.bind(this)} />) : null}
          </div>
          <h2>{title}</h2>
          {desc? <p className="description">{desc}</p> : null}
          {filters ? (<Filters.Controls state={this.props.state}
            hideFilter={this.hideFilter.bind(this)} filters={filters}
            apply={this.updateFilters.bind(this)} />
          ) : null}
        </div>

        <Datagrid state={this.props.state} fields={fields} onSort={this.onListSort.bind(this)} onRowSelection={this.onSelect.bind(this)} />
        <Pagination state={this.props.state} onChange={this.onPageChange.bind(this)} />
      </div>
    )
  }
}

export default ListView
