import React from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router'

import NotFoundView from './NotFound';

import Datagrid from '../Component/Datagrid/Datagrid';
import MaDatagridPagination from '../Component/Datagrid/MaDatagridPagination';
import ViewActions from '../Component/ViewActions';
import Filters from '../Component/Datagrid/Filters';

@observer
class ListView extends React.Component {

    componentDidMount() {
        this.props.state.loadListData(this.props.routeParams.entity);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity) {
            this.props.state.loadListData(nextProps.params.entity);
        } else if(nextProps.location.query.page !== this.props.location.query.page) {
            this.props.state.updatePage(nextProps.location.query.page);
        } else if(nextProps.location.query.sortField !== this.props.location.query.sortField ||
            nextProps.location.query.sortDir !== this.props.location.query.sortDir) {
            this.props.state.updateSort(nextProps.location.query.sortField, nextProps.location.query.sortDir);
        }
    }

    initFilters() {
        const viewFilters = this.getView().filters();
        let selected = viewFilters.filter(filter => filter.pinned());
        let unselected = [];

        const { search } = this.props.location.query || {};
        for (let filter of viewFilters) {
            if (filter.pinned()) {
                continue;
            }

            if (search && filter.name() in search) {
                selected.push(filter);
            } else {
                unselected.push(filter);
            }
        }
    }

    showFilter(filter) {
        // ApplicationActions.showFilter(filter);
    }

    hideFilter(filter) {
        return () => {
            // ApplicationActions.hideFilter(filter);
            this.updateFilterField(filter.name(), null);
        };
    }

    updateFilterField(name, value) {
        let query = this.props.location.query || {};

        if (!query.search) {
            query.search = {};
        }

        if (query.page) {
            delete query.page;
        }

        if ('string' === typeof value && !value.length) {
            value = null;
        }

        let hasModification = false;
        if (value !== null && value !== undefined) {
            query.search[name] = value;
            hasModification = true;
        } else if (name in query.search) {
            delete query.search[name];
            hasModification = true;
        }

        if (0 === Object.keys(query.search).length) {
            delete query.search;
        }

        if (hasModification) {
            this.refreshList(query);
        }
    }

    onListSort(field, dir) {
        this._changeQuery({sortDir: dir, sortField: field});
    }

    _changeQuery(newquery) {
        let query = Object.assign({}, this.props.location.query || {});
        Object.assign(query, newquery);
        const serialized = Object.keys(query).reduce( (a,k) => {
            a.push(k + '=' + encodeURIComponent(query[k]));
            return a
        }, []).join('&');

        browserHistory.push(`${this.props.location.pathname}?${serialized}`);
    }

    onPageChange(page) {
        this._changeQuery({page: page});
    }

    buildPagination(view) {
        const totalItems = this.props.state.totalItems;
        const page = +this.props.state.page;

        return <MaDatagridPagination totalItems={totalItems} page={page}
          perPage={view.perPage()} onChange={this.onPageChange.bind(this)} />;
    }

    buildFilters() {
      // if (!filters.get('selected').isEmpty()) {
      //     filter = (
      //         <Filters
      //             filters={filters.get('selected')}
      //             entity={view.entity}
      //             dataStore={dataStore}
      //             hideFilter={this.boundedHideFilter}
      //             updateField={this.boundedUpdateFilterField} />
      //         );
      // }
    }

    render() {
        if (this.props.state.loading) {
          return null;
        }

        if (this.props.state.resourceNotFound) {
            return <NotFoundView/>;
        }

        const dataStore = this.props.state.dataStore;
        if(!dataStore) {
          return null;
        }

        const entityName = this.props.state.entityName;
        const view = this.props.state.view;
        const filters = this.props.state.filters;
        const sortDir = this.props.state.sortDir;
        const sortField = this.props.state.sortField;

        if(! view.listActions) {  // hack: not yet loaded. Solve with more optimal components
          return null;
        }

        const entries = dataStore.getEntries(view.entity.uniqueId);
        let datagrid = null;
        let filter = null;

        if (entries && entries.length) {
            datagrid = (
                <Datagrid
                    name={view.name()}
                    entityName={this.props.state.entityName}
                    listActions={view.listActions()}
                    fields={view.getFields()}
                    entries={entries}
                    sortDir={sortDir}
                    sortField={sortField}
                    onSort={this.onListSort.bind(this)}
                />
            );
        }

        return (
            <div className="view list-view">
                <ViewActions
                    entityName={this.props.state.entityName}
                    buttons={this.props.state.viewActions}
                    filters={this.props.state.unselectedFilters}
                    showFilter={this.showFilter.bind(this)} />

                <div className="page-header">
                    <h1>{view.title() || entityName + ' list'}</h1>
                    <p className="description">{view.description()}</p>
                </div>

                {this.buildFilters()}

                {datagrid}

                {this.buildPagination(view)}
            </div>
        );
    }
}

export default ListView;
