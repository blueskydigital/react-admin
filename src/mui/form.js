import React from 'react'
import { observer } from 'mobx-react'
import SaveIcon from 'material-ui/svg-icons/content/save'
import RaisedButton from 'material-ui/RaisedButton'
import EditFormBase from '../components/edit/form'

@observer
class SubmitButton extends React.Component {
  render() {
    const { errors, text } = this.props
    const submitDisabled = errors.size > 0

    return (
      <RaisedButton label={text} primary={true} icon={<SaveIcon />}
        disabled={submitDisabled} onTouchTap={this.props.onSubmit}/>
    )
  }
}

@observer
class MUIEditForm extends EditFormBase {

  buildField(name, CustomComponent, record, errors, onChange) {
    return (
      <div key={`fld_${name}`}>
        <CustomComponent attr={name} record={record} errors={errors} onChange={onChange} />
      </div>
    )
  }

  render() {
    const { title, desc, state, saveText } = this.props

    return (
      <div className="view edit-view">
        <div className="row">
          <h2>{title}</h2>
          {desc ? (<p className="description">{desc}</p>) : null}
        </div>
        <div className="row form-horizontal" id="edit-view">
          <form className="col-lg-12 form-horizontal">
            {this.buildFields()}
          </form>
        </div>
        <div className="row form-horizontal">
          <SubmitButton onSubmit={this.save.bind(this)} errors={state.errors} text={saveText} />
        </div>
      </div>
    )
  }
}
export default MUIEditForm
