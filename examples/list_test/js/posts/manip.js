import React from 'react'

import TextInput from '../../../../src/mui/input/text'
import EditViewBase from '../../../../src/components/view/edit'
import MUIEditForm from '../../../../src/mui/form'


export default class PostEditView extends EditViewBase {

  static defaultProps = {
    entityName: 'posts'
  }

  render() {
    const { state } = this.props

    const fields = {
      'title': {
        component: (props) => {
          return (<TextInput label={'Title'} {...props} />)
        },
        validators: [
          {fn: (val) => (val.length === 0), message: "title must be provided"},
          {fn: (val) => (val.length > 10), message: "title too long"},
        ]
      },
      'category': {
        component: (props) => (<TextInput label={'Category'} {...props} />)
      }
    }

    return (
      <MUIEditForm fields={fields} state={state} createtitle='create post' saveText="SAVE" />
    )
  }
}
