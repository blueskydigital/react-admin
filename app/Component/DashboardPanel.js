import React from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

import Datagrid from './Datagrid/Datagrid';

class DashboardPanel extends React.Component {
    render() {
        const view = this.props.view;
        const entity = view.entity;
        const to = `/${entity.name()}/list`;

        return (
            <div>
                <div className="panel-heading">
                    <Link to={to}>{this.props.label}</Link>
                </div>

                <Datagrid
                    name={view.name()}
                    entity={entity}
                    fields={view.fields()}
                    state={this.props.state}
                    listActions={[]}
                    />
            </div>
        );
    }
}

DashboardPanel.propTypes = {
    view: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    state: React.PropTypes.object.isRequired
};

@observer
class DashboardPanels extends React.Component {

    buildPanels(panels, odd=true) {
        const panelViews = [];
        let label, view;

        panels
            .filter((v, k) => (odd && (0 !== k % 2)) || (!odd && (0 === k % 2)))
            .forEach((panel, key) => {
                label = panel.label;
                view = panel.view;

                panelViews.push((
                    <div key={key} className="panel panel-default">
                        <DashboardPanel
                            label={label}
                            view={view}
                            state={this.props.state}
                        />
                    </div>
                ));
            });

        return panelViews;
    }

    render() {
        const panels = this.props.state.panels || [];

        if (! panels.length) {
            return null;
        }

        return (
            <div className="row dashboard-content">
                <div className="col-lg-6">
                    {this.buildPanels(panels, false)}
                </div>
                <div className="col-lg-6">
                    {this.buildPanels(panels, true)}
                </div>
            </div>
        )
    }
}

DashboardPanels.propTypes = {
    state: React.PropTypes.object.isRequired
};

export default DashboardPanels;
