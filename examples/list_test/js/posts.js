import React from 'react'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'

import TextField from '../../../src/components/field/text'
import TextInput from '../../../src/components/input/text'
import ListView from '../../../src/views/list'
import EditView from '../../../src/views/edit'

export default (state) => {

  return {
    'createListView': (props) => {
      var fields = {
        'id': {title: 'ID', creator: (row) => (<TextField record={row} attr="id" />)},
        'title': {title: 'Title', creator: (row) => (<TextField record={row} attr="title" maxlen="32" />)},
        'category': {title: 'Cat', creator: (row) => (<TextField record={row} attr="category" />)}
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
        if(confirm(`Are you sure you want to delete ${row.title}?`)) {
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
        <ListView {...props} fields={fields} entityName='posts' title='posts'
          listActions={listActions} actions={batchActions} filters={filters} />
      )
    },

    'createManip': (props) => {

      var fields = {
        'title': {
          component: (prps) => (<TextInput attr="title" label={'Title'} {...prps} />),
          validators: [
            {fn: (val) => (val.length === 0), message: "title must be provided"},
            {fn: (val) => (val.length > 10), message: "title too long"},
          ]
        },
        'category': {
          component: (prps) => (<TextInput attr="category" label={'Category'} {...prps} />)
        }
      }

      return (
        <EditView {...props} fields={fields} entityName='posts' createtitle='create post' />
      )
    }
  }

}
