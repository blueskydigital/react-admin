import React from 'react'
import { observer } from 'mobx-react'
import DatePicker from 'material-ui/DatePicker'

@observer
class TextInput extends React.Component {

  static propTypes = {
    attr: React.PropTypes.string.isRequired,
    record: React.PropTypes.object.isRequired,
    label: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object
  }

  handleChange = (_, value) => {
    this.props.onChange(this.props.attr, value)
  }

  datify(value) {
    const dateVal = value instanceof Date ? value : new Date(value)
    return isNaN(dateVal.getTime()) ? null : dateVal
  }

  render() {
    const { attr, label, record, errors } = this.props
    const errorText = errors ? errors.get(attr) : undefined
    const dateVal = this.datify(record.get(attr))
    return (
      <DatePicker
        errorText={errorText}
        floatingLabelText={label}
        container="inline"
        autoOk
        value={dateVal}
        onChange={this.handleChange.bind(this)} />
    )
  }
}

export default TextInput
