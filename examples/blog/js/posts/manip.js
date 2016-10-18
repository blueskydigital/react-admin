import React from 'react'

import TextInput from 'react-mobx-admin/mui/input/text'
import DateInput from 'react-mobx-admin/mui/input/date'
import EditViewBase from 'react-mobx-admin/components/view/edit'
import MUIEditView from 'react-mobx-admin/mui/view/edit'


export default class PostEditView extends EditViewBase {

  static defaultProps = {
    entityName: 'posts'
  }

  render() {
    const { state } = this.props

    class PostEditForm extends React.Component {
      render() {
        const { onChange, state } = this.props
        return (
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <TextInput label={'title'} attr={'title'} record={state.entity} onChange={onChange} validators={[
                {fn: (val) => (val.length === 0), message: 'title must be provided'},
                {fn: (val) => (val.length > 10), message: 'title too long'},
              ]} errors={state.errors} /><br/>
              <TextInput label={'Category'} attr={'category'} record={state.entity} onChange={onChange} />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <DateInput label={'published'} attr={'published_at'} record={state.entity} onChange={onChange} /><br/>
            </div>
          </div>
        )
      }
    }

    return (
      <MUIEditView state={state} createtitle='create new post'
        edittitle='edit post' saveText="SAVE"
        saveData={this.save.bind(this)}
        return2List={this.return2List.bind(this)}
        formcomponent={PostEditForm} />
    )
  }
}
