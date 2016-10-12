import axios from 'axios'

class DataRequester {

  constructor(convertQuery, getTotalItems) {
    this.convertQuery = convertQuery
    this.getTotalItems = getTotalItems
  }

  getEntries(entityName, params) {

    let qParams = this.convertQuery(params)

    return axios.get(`${Conf.apiUrl}/${entityName}`, {params: qParams}).then((response) => {
      return {
        data: response.data,
        totalItems: this.getTotalItems(response)
      }
    })

  }

  getEntry(entityName, id, options={}) {

    return axios.get(`${Conf.apiUrl}/${entityName}/${id}`)

  }

  saveEntry(entityName, data, id=null) {
    let query

    if (id) {
      query = axios.put(`${Conf.apiUrl}/${entityName}/${id}`, data)
    } else {
      query = axios.post(`${Conf.apiUrl}/${entityName}`, data)
    }

    return query.then((response) => {
      return response.data
    })
  }
}

export default DataRequester
