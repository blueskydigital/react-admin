import React from 'react'
import { observer } from 'mobx-react'
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table'
import DatagridBase from '../../components/datagrid/datagrid'

@observer
class MUIDatagrid extends DatagridBase {

  renderHeader(Header, name, label, sort, onSort) {
    return (
      <TableHeaderColumn key={`th_${name}`}>
        <Header sort={sort} name={name} label={label} onSort={onSort} />
      </TableHeaderColumn>
    )
  }

  renderCell(row, name, creatorFn, rowId) {
    return (
      <TableRowColumn key={`td_${rowId}_${name}`}>
        {creatorFn(row)}
      </TableRowColumn>
    )
  }

  renderListActions(listActions) {
    return(
      <TableRowColumn key={'datagrid-actions'}>{listActions}</TableRowColumn>
    )
  }

  render() {
    const { rowId, state } = this.props
    const selectable = this.props.onRowSelection !== undefined

    if(state.items.length === 0) {
      return null
    }

    return (
      <Table selectable={selectable} onRowSelection={this.props.onRowSelection} multiSelectable={true}>
        <TableHeader>
          <TableRow>{this.buildHeaders()}</TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={selectable} deselectOnClickaway={false}>
          {state.items.map((r, i) => {
            const id = rowId(r)
            const selected = state.selection.indexOf(i) >= 0
            return (<TableRow selected={selected} key={i}>{this.buildCells(r, id)}</TableRow>)
          })}
        </TableBody>
      </Table>
    )
  }
}
export default MUIDatagrid
