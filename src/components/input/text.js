import React from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'

@observer
class TextInput extends React.Component {

  static propTypes = {
    attr: React.PropTypes.string.isRequired,
    record: React.PropTypes.object.isRequired,
    label: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object
  }

  handleChange = (event) => {
    this.props.onChange(this.props.attr, event.target.value)
  }

  render() {
    const { attr, label, record, errors } = this.props
    const errorText = errors ? errors.get(attr) : undefined
    return (
      <TextField name={attr} floatingLabelText={label}
        value={record[attr] || ''} onChange={this.handleChange}
        errorText={errorText} />
    )
  }
}

export default TextInput
