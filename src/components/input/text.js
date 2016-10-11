import React from 'react'
import TextField from 'material-ui/TextField'

class TextInput extends React.Component {

  static propTypes = {
    attr: React.PropTypes.string.isRequired,
    record: React.PropTypes.object.isRequired,
    label: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  }

  handleChange = (event) => {
    this.props.onChange(this.props.attr, event.target.value)
  }

  render() {
    const { attr, label, record } = this.props
    return (
      <TextField name={attr} floatingLabelText={label}
        value={record[attr] || ''} onChange={this.handleChange} />
    )
  }
}

export default TextInput
