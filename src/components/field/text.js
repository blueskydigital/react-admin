import React from 'react'

const TextField = ({ attr, record = {}, maxlen }) => (
  <span>{maxlen ? (record[attr].substring(0, parseInt(maxlen)) + ' ...') : record[attr]}</span>
)

TextField.propTypes = {
    attr: React.PropTypes.string.isRequired,
    record: React.PropTypes.object.isRequired
}

export default TextField;
