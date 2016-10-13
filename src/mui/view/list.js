import React from 'react'

import Datagrid from '../datagrid/datagrid'
import Filters from '../datagrid/filters'
import Pagination from '../datagrid/pagination'
import DatagridActions from '../../components/datagrid/actions'


export default class MUIListView extends React.Component {

  render() {
    const {
      state, title, desc, fields, actions,
      onSort, onPageChange, onRowSelection,
      filters, onShowFilter, onHideFilter, onFilterApply // optional props
    } = this.props

    return (
      <div className="view list-view">
        <div className="page-header">
          <div style={{float: 'right'}}>
            {actions ? (<DatagridActions state={state} actions={actions} />) : null}
          </div>
          <div style={{float: 'right'}}>
            {filters ? (<Filters.Dropdown state={state} filters={filters} showFilter={onShowFilter} />) : null}
          </div>
          <h2>{title}</h2>
          {desc? <p className="description">{desc}</p> : null}
          {filters ? (
            <Filters.Controls state={state} hideFilter={onHideFilter} filters={filters} apply={onFilterApply} />
          ) : null}
        </div>

        <Datagrid state={state} fields={fields} onSort={onSort} onRowSelection={onRowSelection} />
        <Pagination state={state} onChange={onPageChange} />
      </div>
    )
  }

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    listActions: React.PropTypes.func,
    onSort: React.PropTypes.func.isRequired,
    onPageChange: React.PropTypes.func.isRequired,
    onRowSelection: React.PropTypes.func,
    onShowFilter: React.PropTypes.func,
    onHideFilter: React.PropTypes.func,
    onFilterApply: React.PropTypes.func
  }

}
