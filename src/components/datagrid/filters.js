import React from 'react'
import _ from 'lodash'

// dropdown with available filters
class DropdownBase extends React.Component {

  static propTypes = {
    filters: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    showFilter: React.PropTypes.func.isRequired
  }

  createItems(state, filters) {
    return _.map(filters, (val, name) => {
      if(name in state.filters) {
        return null // don't add to menu already visible filters
      } else {
        const showFilter = () => {
          state.showFilter(name)
        }
        return this.renderItem(name, val.title, val.icon, showFilter)
      }
    })
  }

}

// controls to set filter values
class ControlsBase extends React.Component {

  static propTypes = {
    filters: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    hideFilter: React.PropTypes.func.isRequired,
    apply: React.PropTypes.func.isRequired
  }

  buildRows(filters, state) {
    let rows = []
    for(let name in filters) {
      if(name in state.filters) {  // is visible
        const value = state.filters[name]
        const filter = filters[name]
        const onHide = () => {this.props.hideFilter(name)}
        const onUpdate = (name, val) => {state.updateFilterValue(name, val)}
        const ctrl = this.renderControl(filter, name, state, onHide, onUpdate)
        rows.push(ctrl)
      }
    }
    return rows
  }

  render() {
    const { filters, apply, state } = this.props
    const controls = this.buildRows(filters, state)

    return (controls.length > 0) ? this.renderControls(controls, apply) : null
  }
}

export default { DropdownBase, ControlsBase }
