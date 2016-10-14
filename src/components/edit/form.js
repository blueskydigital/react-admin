import React from 'react'


export default class EditFormBase extends React.Component {

  updateField(name, value) {
    const validators = this.props.fields[name].validators
    this.props.state.updateData(name, value, validators)
  }

  buildFields() {
    const { fields, state } = this.props
    const updateField = this.updateField.bind(this)
    let inputs = []

    for(let name in fields) {
      const val = fields[name]
      inputs.push(
        this.buildField(name, val.component, state.entity, state.errors, updateField)
      )
    }
    return inputs
  }

  onUpdated() {
    alert('Changes successfully saved.')
  }

  onSave(e) {
    e.preventDefault()
    this.props.saveData().then(this.onUpdated.bind(this))
  }

  onSaveAndReturn2list(e) {
    e.preventDefault()
    this.props.saveData().then(this.onUpdated.bind(this))
    .then(() => {
      this.props.return2List()
    })
  }

  onCancel(e) {
    e.preventDefault()
    this.props.return2List()
  }

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    saveData: React.PropTypes.func.isRequired,
    return2List: React.PropTypes.func.isRequired
  }

}
