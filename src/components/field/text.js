import React from 'react'
import { Link } from 'react-router'

export default class AppComponent extends React.Component {

  static propTypes = {
      attr: React.PropTypes.string.isRequired,
      record: React.PropTypes.object.isRequired,
      maxlen: React.PropTypes.number,
      to: React.PropTypes.string
  }

  render() {
    const { attr, record, maxlen, to } = this.props
    const val = maxlen ? (record[attr].substring(0, maxlen) + ' ...') : record[attr]
    return to ? (<Link to={to}>{val}</Link>) : (<span>{val}</span>)
  }

}
