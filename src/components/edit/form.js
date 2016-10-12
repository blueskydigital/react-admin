import React from 'react'


export default class EditFormBase extends React.Component {

  save(e) {
    e.preventDefault()
    this.props.state.saveData(this.props.entityName).then(this.onUpdated.bind(this))
  }

  onUpdated() {
    alert('Changes successfully saved.')
  }

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

}
