import axios from 'axios';

class DataRequester {

  _apiFlavor(q) {
    const perPage = q.perPage || 10
    let converted = {
      _start: (q.page - 1) * perPage,
      _limit: perPage
    }
    if(q.sortField) {
      converted._sort = q.sortField
      converted._order = q.sortDir
    }
    for(let i in q.filters) {
      converted[i] = q.filters[i]
    }
    return converted
  }

  _getResponseTotalItems(response) {
    return parseInt(response.headers['x-total-count']) || response.data.length;
  }

  getEntries(entityName, params) {

    let qParams = this._apiFlavor(params);

    return axios.get(`${Conf.apiUrl}/${entityName}`, {params: qParams}).then((response) => {
      return {
        data: response.data,
        totalItems: this._getResponseTotalItems(response)
      };
    });

  }

  createEntry(view) {

  }

  getEntry(id, entityName, options={}) {

    return axios.get(`${Conf.apiUrl}/${entityName}/${id}`);

  }

  saveEntry(data, id=null) {
      let query;

      if (id) {
        query = axios.put(`${Conf.apiUrl}/${data.Type}/${id}`, data)
      } else {
        query = axios.post(`${Conf.apiUrl}/${data.Type}`, data)
      }

      return query.then((response) => {
        return response.data;
      });
  }
}

export default DataRequester
