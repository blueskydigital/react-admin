import React from 'react'
import { observer } from 'mobx-react'
import SaveIcon from 'material-ui/svg-icons/content/save'
import RaisedButton from 'material-ui/RaisedButton'
import EditFormBase from '../components/edit/form'
import { Card, CardTitle, CardActions } from 'material-ui/Card'

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
    const { edittitle, createtitle, desc, state, saveText } = this.props
    const title = state.originEntityId ? edittitle : createtitle

    return (
      <Card style={{ margin: '1em'}}>
        <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
          <SubmitButton onSubmit={this.save.bind(this)} errors={state.errors} text={saveText} />
        </CardActions>

        <CardTitle title={title} subtitle={desc} />

        <form style={{ padding: '0 1em 1em 1em' }}>
          {this.buildFields()}
        </form>

        <CardActions>
          <SubmitButton onSubmit={this.save.bind(this)} errors={state.errors} text={saveText} />
        </CardActions>
      </Card>
    )
  }
}
export default MUIEditForm
