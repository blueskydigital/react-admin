import React from 'react'
import { Card, CardTitle, CardActions } from 'material-ui/Card'
import Datagrid from '../datagrid/datagrid'
import Filters from '../datagrid/filters'
import Pagination from '../datagrid/pagination'
import DatagridActions from '../../components/datagrid/actions'


export default class MUIListView extends React.Component {

  render() {
    const {
      state, title, desc, fields, actions,
      rowId, onSort, onPageChange, onRowSelection,
      filters, onShowFilter, onHideFilter, onFilterApply // optional props
    } = this.props

    return (
      <Card style={{ margin: '2em', opacity: state.loading ? 0.8 : 1 }}>
        <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
          <Filters.Apply state={state} label={'apply filters'} apply={onFilterApply} />
          {actions && (<DatagridActions state={state} actions={actions} />)}
          {filters && (<Filters.Dropdown state={state} title="addfilter" filters={filters} showFilter={onShowFilter} />)}
        </CardActions>

        <CardTitle title={title} />

        {filters && (
          <Filters.Controls state={state} hideFilter={onHideFilter} filters={filters} />
        )}

        <Datagrid state={state} fields={fields} rowId={rowId} onSort={onSort} onRowSelection={onRowSelection} />
        <Pagination state={state} onChange={onPageChange} />
      </Card>
    )
  }

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    rowId: React.PropTypes.func.isRequired,
    listActions: React.PropTypes.func,
    onSort: React.PropTypes.func.isRequired,
    onPageChange: React.PropTypes.func.isRequired,
    onRowSelection: React.PropTypes.func,
    onShowFilter: React.PropTypes.func,
    onHideFilter: React.PropTypes.func,
    onFilterApply: React.PropTypes.func
  }

}
