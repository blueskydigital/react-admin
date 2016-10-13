import React, { PropTypes } from 'react'

const TextField = ({ attr, record = {} }) => (
  <span>{record[source] instanceof Date ? record[source].toLocaleDateString() : (new Date(record[source])).toLocaleDateString()}</span>
)

TextField.propTypes = {
    attr: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired
}

export default TextField
