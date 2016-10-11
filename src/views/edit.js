import React from 'react'
import { observer } from 'mobx-react'
import RaisedButton from 'material-ui/RaisedButton'
import SaveIcon from 'material-ui/svg-icons/content/save'

@observer
class SubmitButton extends React.Component {
  render() {
    const { errors } = this.props
    const submitDisabled = errors.size > 0

    return (
      <RaisedButton label={'save'} primary={true} icon={<SaveIcon />}
        disabled={submitDisabled} onTouchTap={this.props.onSubmit}/>
    )
  }
}

@observer
class EditView extends React.Component {

  _getId() {
    const id = this.props.routeParams.id
    return (id && id[0] === '_') ? undefined : id
  }

  componentDidMount() {
    const id = this._getId()
    if(id === undefined) {
      this.props.state.loadCreateData(this.props.fields)
    } else {
      this.props.state.loadEditData(this.props.entityName, id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.props.state.loadEditData(nextProps.params.entity, nextProps.params.id)
    }
  }

  updateField(name, value) {
    const validators = this.props.fields[name].validators
    this.props.state.updateData(name, value, validators)
  }

  save(e) {
    e.preventDefault()
    this.props.state.saveData(this.props.entityName).then(this.onUpdated.bind(this))
  }

  onUpdated() {
    alert('Changes successfully saved.')
  }

  buildFields(fields, state) {
    let inputs = []

    for(let name in fields) {
      const val = fields[name]

      inputs.push(
        <div className="form-field form-group" key={`inpt_${name}`}>
          <val.component record={state.entity} errors={state.errors} onChange={this.updateField.bind(this)} />
        </div>
      )
    }
    return inputs
  }

  render() {
    const { title, desc, fields, state } = this.props

    return (
      <div className="view edit-view">

        <div className="page-header">
          <h2>{title}</h2>
          {desc ? (<p className="description">{desc}</p>) : null}
        </div>

        <div className="row form-horizontal" id="edit-view">
          <form className="col-lg-12 form-horizontal" >

            {this.buildFields(fields, state)}

            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <SubmitButton onSubmit={this.save.bind(this)} errors={state.errors} />
              </div>
            </div>

          </form>
        </div>

      </div>
    )
  }

}

export default EditView
