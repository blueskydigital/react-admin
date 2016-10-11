import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash'
import ContentFilter from 'material-ui/svg-icons/content/filter-list'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'

// dropdown with available filters
@observer
class Dropdown extends React.Component {

  static propTypes = {
    filters: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    showFilter: React.PropTypes.func.isRequired
  }

  render() {
    const { filters, state } = this.props

    let menuItems = _.map(filters, (val, name) => {
      if(name in state.filters) {
        return null // don't add to menu already visible filters
      } else {
        return (
          <MenuItem key={name} primaryText={val.title} leftIcon={val.icon} onClick={() => state.showFilter(name)}/>
        )
      }
    })

    return (
      <IconMenu iconButtonElement={<IconButton><ContentFilter /></IconButton>}>
        {menuItems}
      </IconMenu>
    )
  }
}

// controls to set filter values
@observer
class Controls extends React.Component {

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

        let deleteLink = (
            <a className="remove" onClick={() => {this.props.hideFilter(name)}}>
                rem
            </a>
        )

        rows.push(
          <div className={`form-field form-group filter-${name}`} key={name}>
              <span className="col-sm-1 col-xs-1">{deleteLink}</span>
              <filter.component record={state.filters} attr={name} label={filter.label}
                onChange={(name, val) => {state.updateFilterValue(name, val)}} />
          </div>
        )
      }
    }
    return rows
  }

  render() {
    const { filters, apply, state } = this.props
    const controls = this.buildRows(filters, state)

    return (controls.length > 0) ? (
      <div className="filters form-horizontal">
        <div>
          {controls}
        </div>
        <button onClick={apply}>apply</button>
      </div>
    ) : null
  }
}

export default { Dropdown, Controls }
