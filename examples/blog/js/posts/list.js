import React from 'react'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'

import TextField from '../../../../src/components/field/text'
import DateField from '../../../../src/components/field/date'
import TextInput from '../../../../src/mui/input/text'
import ListViewBase from '../../../../src/components/view/list'
import MUIListView from '../../../../src/mui/view/list'

export default class PostListView extends ListViewBase {

  static defaultProps = {
    entityName: 'posts'
  }

  render() {
    const { state } = this.props
    const fields = {
      'id': {title: 'ID', creator: (row) => (<TextField record={row} attr="id" />)},
      'title': {title: 'Title', creator: (row) => {
        return (<TextField record={row} attr="title" maxlen={32} to={`/posts/${row.id.toString()}`}/>)
      }},
      'category': {title: 'Cat', creator: (row) => (<TextField record={row} attr="category" />)},
      'published_at': {title: 'Published', creator: (row) => (<DateField record={row} attr="published_at" />)}
    }
    function rowId(row) {
      return row.id
    }
    function _deleteRow(row) {
      if(confirm(`Are you sure you want to delete ${row.title}?`)) {
        state.deleteData([row])
      }
    }
    function listActions(row) {
      return (
        <div>
          <IconButton onClick={() => { _deleteRow(row)}}><DeleteIcon /></IconButton>
        </div>
      )
    }
    function _batchDelete() {
      if(confirm(`Are you sure you want to delete selected items?`)) {
        state.deleteSelected()
      }
    }
    function batchActions() {
      return (
        <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
          <MenuItem primaryText="delete" leftIcon={<DeleteIcon />} onClick={() => _batchDelete()}/>
        </IconMenu>
      )
    }
    var filters = {
      'category': {title: 'Category', icon: <DeleteIcon />, component: (props) => (<TextInput {...props} />)}
    }

    return (
      <MUIListView state={state} fields={fields} title='posts'
        listActions={listActions} actions={batchActions} filters={filters}
        rowId={rowId}
        onSort={this.onListSort.bind(this)}
        onPageChange={this.onPageChange.bind(this)}
        onRowSelection={this.onSelect.bind(this)}
        onShowFilter={this.showFilter.bind(this)}
        onHideFilter={this.hideFilter.bind(this)}
        onFilterApply={this.applyFilters.bind(this)}
      />
    )
  }

}
