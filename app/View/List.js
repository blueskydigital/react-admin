import React from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router'

import DevTools from 'mobx-react-devtools';

import NotFoundView from './NotFound';

import Datagrid from '../Component/Datagrid/Datagrid';
import MaDatagridPagination from '../Component/Datagrid/MaDatagridPagination';
import ViewActions from '../Component/ViewActions';
import Filters from '../Component/Datagrid/Filters';

@observer
class ObservableListView extends React.Component {

    buildPagination(view) {
        const totalItems = this.props.state.totalItems;
        const page = +this.props.state.page;

        return <MaDatagridPagination totalItems={totalItems} page={page}
          perPage={view.perPage()} onChange={this.props.changePage} />;
    }

    buildFilters() {
        if (this.props.state.visibleFilters.length > 0) {
            return (
                <Filters
                    filters={this.props.state.visibleFilters}
                    values={this.props.state.filterValues}
                    entity={this.props.state.view.entity}
                    dataStore={this.props.state.dataStore}
                    hideFilter={this.props.hideFilter}
                    updateField={this.props.updateFilterField} />
            );
        }
    }

    render() {
        const view = this.props.state.view;
        if(! view || view.type != 'ListView') {
           return null;
        }

        return (
            <div className="view list-view">
                <DevTools />
                <ViewActions state={this.props.state} showFilter={this.props.showFilter} />

                <div className="page-header">
                    <h1>{view.title() || view.entity.name() + ' list'}</h1>
                    <p className="description">{view.description()}</p>
                </div>

                {this.buildFilters()}

                <Datagrid
                    name={view.name()}
                    entity={view.entity}
                    listActions={view.listActions()}
                    fields={view.getFields()}
                    state={this.props.state}
                    onSort={this.props.onSort}
                />

                {this.buildPagination(view)}
            </div>
        );
    }
}
ObservableListView.propTypes = {
    state: React.PropTypes.object.isRequired,
    showFilter: React.PropTypes.func.isRequired,
    hideFilter: React.PropTypes.func.isRequired,
    updateFilterField: React.PropTypes.func.isRequired,
    changePage: React.PropTypes.func.isRequired,
    onSort: React.PropTypes.func.isRequired
};

class ListView extends React.Component {

    componentDidMount() {
        this.props.state.loadListData(this.props.routeParams.entity);
        const viewFilters = this.props.state.view.filters();
        if(viewFilters.length > 0) {
            this.initFilters(viewFilters);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity) {
            this.props.state.loadListData(nextProps.params.entity);
        } else if(nextProps.location.query.page !== this.props.location.query.page) {
            this.props.state.updatePage(nextProps.location.query.page);
        } else if(nextProps.location.query.sortField !== this.props.location.query.sortField ||
            nextProps.location.query.sortDir !== this.props.location.query.sortDir) {
            this.props.state.updateSort(nextProps.location.query.sortField, nextProps.location.query.sortDir);
        } else if(nextProps.location.query.search !== this.props.location.query.search) {
            const newFilters = nextProps.location.query.search;
            this.props.state.updateFilters(newFilters ? JSON.parse(newFilters) : {});
        }
    }

    initFilters(viewFilters) {
        let selected = viewFilters.filter(filter => filter.pinned());

        const search = this.props.location.query.search || {};
        Object.assign(search, selected);
        if(search.length > 0) {
          this._changeQuery({search: search});
        }
    }

    showFilter(filter) {
        this.props.state.showFilter(filter);
    }

    hideFilter(filter) {
        // just set the filter query to null -> new props -> state:updateFilters
        this.updateFilterField(filter.name(), null);
    }

    updateFilterField(name, value) {
        let query = this.props.location.query || {};
        let search = query.search ? JSON.parse(query.search) : {};

        if ('string' === typeof value && !value.length) {
            value = null;
        }

        let hasModification = false;
        if (value !== null && value !== undefined) {
            search[name] = value;
            hasModification = true;
        } else if (name in search) {
            delete search[name];
            hasModification = true;
        }

        if (0 === Object.keys(search).length) {
            return this._changeQuery({search: null});
        }

        if (hasModification) {
            this._changeQuery({search: search});
        }
    }

    onListSort(field, dir) {
        this._changeQuery({sortDir: dir, sortField: field});
    }

    _changeQuery(newquery) {
        let query = Object.assign({}, this.props.location.query || {});
        for(let k in newquery) {
          if(newquery[k] === null) { // removal
            delete query[k]
          } else {
            query[k] = newquery[k]; // adding
          }
        }
        const serialized = Object.keys(query).reduce( (a,k) => {
            const val = typeof query[k] === 'object' ?
              JSON.stringify(query[k]) : encodeURIComponent(query[k]);
            a.push(k + '=' + val);
            return a
        }, []).join('&');

        browserHistory.push(`${this.props.location.pathname}?${serialized}`);
    }

    onPageChange(page) {
        this._changeQuery({page: page});
    }

    render() {
        return <ObservableListView
            state={this.props.state}
            showFilter={this.showFilter.bind(this)}
            hideFilter={this.hideFilter.bind(this)}
            updateFilterField={this.updateFilterField.bind(this)}
            changePage={this.onPageChange.bind(this)}
            onSort={this.onListSort.bind(this)}
        />
    }
}

export default ListView;
