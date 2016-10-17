import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash'
import Header from './header'


export default class DatagridBase extends React.Component {

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    rowId: React.PropTypes.func.isRequired, // func that returns unique ID from given row
    onSort: React.PropTypes.func,
    listActions: React.PropTypes.func
  }

  buildHeaders() {
    const { name, listActions, onSort } = this.props
    const { sortDir, sortField } = this.props.state

    let headers = _.map(this.props.fields, (val, name) => {
      const sort = (sortField === name) ? sortDir : null
      return this.renderHeader(Header, name, val.title, sort, onSort)
    })

    // add another th for List actions if any
    if (listActions) {
      headers.push(<th key={'_actions'}></th>)
    }

    return headers
  }

  buildCells(row, rowId) {
    let cells = _.map(this.props.fields, (val, name) => {
      return this.renderCell(row, name, val.creator, rowId)
    })

    if (this.props.listActions) {
      cells.push(this.renderListActions(this.props.listActions(row)))
    }

    return cells
  }

}
