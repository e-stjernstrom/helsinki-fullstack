import axios from "axios"
// updated to relative path
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl) // Promise<Response>
    return request.then(response => response.data) // Promise<Data>
}

const create = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const del = (id) => {
    return axios.delete(`${baseUrl}/${id}`) // returns 204 No Content by default
}

export default {
    getAll, create, update, del
}