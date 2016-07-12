import React from 'react';
import { observer } from 'mobx-react';

import DashboardPanel from '../Component/DashboardPanel';

@observer
class DashboardView extends React.Component {

    // componentDidMount() {
    //     this.boundedOnChange = this.onChange.bind(this);
    //     EntityStore.addChangeListener(this.boundedOnChange);
    //
    //     this.refreshData();
    // }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.query.sortField !== this.props.query.sortField ||
    //         nextProps.query.sortDir !== this.props.query.sortDir) {
    //
    //         this.refreshData();
    //     }
    // }

    refreshData() {
        const {sortField, sortDir} = this.props.location.query || {};

        EntityActions.loadDashboardPanels(this.props.restful, this.props.configuration, sortField, sortDir);
    }

    buildPanels(panels, odd=true) {
        const sortDir = this.state.data.get('sortDir');
        const sortField = this.state.data.get('sortField');
        const dataStore = this.state.data.getIn(['dataStore', 'object']);
        const panelViews = [];
        let label, view;

        panels
            .filter((v, k) => (odd && (0 !== k % 2)) || (!odd && (0 === k % 2)))
            .forEach((panel, key) => {
                label = panel.get('label');
                view = panel.get('view');

                panelViews.push((
                    <div key={key} className="panel panel-default">
                        <DashboardPanel
                            label={label}
                            view={view}
                            dataStore={dataStore}
                            sortDir={sortDir}
                            sortField={sortField} />
                    </div>
                ));
            });

        return panelViews;
    }

    render() {
        const dataStore = this.props.state.dataStore;

        if (!dataStore) {
            return null;
        }

        const panels = this.props.state.panels || [];

        if (!panels.length) {
            return null;
        }

        return (
            <div className="view dashboard-view">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="page-header">
                            <h1>Dashboard</h1>
                        </div>
                    </div>
                </div>

                <div className="row dashboard-content">
                    <div className="col-lg-6">
                        {this.buildPanels(panels, false)}
                    </div>
                    <div className="col-lg-6">
                        {this.buildPanels(panels, true)}
                    </div>
                </div>
            </div>
        );
    }
}

// DashboardView.contextTypes = {
//     restful: React.PropTypes.func.isRequired,
//     configuration: React.PropTypes.object.isRequired
// };

export default DashboardView;
