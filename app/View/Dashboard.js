import React from 'react';
import DashboardPanels from '../Component/DashboardPanel';


class DashboardView extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.query && (
              nextProps.query.sortField !== this.props.query.sortField ||
              nextProps.query.sortDir !== this.props.query.sortDir)) {

            this.props.state.loadDashboardPanels(nextProps.query.sortField, nextProps.query.sortDir);
        }
    }

    componentDidMount() {
        this.props.state.loadDashboardPanels();
    }

    render() {
        return (
            <div className="view dashboard-view">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="page-header">
                            <h1>Dashboard</h1>
                        </div>
                    </div>
                </div>

                <DashboardPanels state={this.props.state} />
            </div>
        );
    }
}

export default DashboardView;
