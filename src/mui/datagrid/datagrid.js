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

  renderCell(row, name, creatorFn, idAttr='id') {
    return (
      <TableRowColumn key={`td_${row[idAttr]}_${name}`}>
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
    const { items } = this.props.state
    const selectable = this.props.onRowSelection !== undefined

    if(items.length === 0) {
      return null
    }

    return (
      <Table selectable={selectable} onRowSelection={this.props.onRowSelection} multiSelectable={true}>
        <TableHeader>
          <TableRow>{this.buildHeaders()}</TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={selectable} deselectOnClickaway={false}>
          {items.map((r, i) => (<TableRow key={i}>{this.buildCells(r)}</TableRow>))}
        </TableBody>
      </Table>
    )
  }
}
export default MUIDatagrid
