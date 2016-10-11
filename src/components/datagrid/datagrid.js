import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash'
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table'

import Header from './header'

@observer
class Datagrid extends React.Component {

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    onSort: React.PropTypes.func,
    listActions: React.PropTypes.func
  }

  buildHeaders() {
    const { name, listActions } = this.props
    const { sortDir, sortField } = this.props.state

    let headers = _.map(this.props.fields, (val, name) => {
      const sort = (sortField === name) ? sortDir : null
      return (
        <TableHeaderColumn key={`th_${name}`}>
          <Header sort={sort} name={name} label={val.title}
            onSort={this.props.onSort} />
        </TableHeaderColumn>
      )
    })

    // add another th for List actions if any
    if (listActions) {
      headers.push(<th key={'_actions'}></th>)
    }

    return headers
  }

  buildCells(row, idAttr='id') {
    let cells = _.map(this.props.fields, (val, name) => {
      return (<TableRowColumn key={`td_${row[idAttr]}_${name}`}>{val.creator(row)}</TableRowColumn>)
    })

    if (this.props.listActions) {
        cells.push(<TableRowColumn key={'datagrid-actions'}>
            {this.props.listActions(row)}
        </TableRowColumn>)
    }

    return cells
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
export default Datagrid
