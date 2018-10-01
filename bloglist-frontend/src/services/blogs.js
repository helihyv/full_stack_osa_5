import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = (newToken) => {
  token = `bearer ${newToken}`

}

const create = async (newBlog) => {

  const config = {
    headers: { 'Authorization': token }
  }

  const response = await axios.post(baseUrl, newBlog, config )

  return response.data
  }

const update = async (updatedBlog) => {
  const updateToSend = {
    user: updatedBlog.user,
    likes: updatedBlog.likes,
    author: updatedBlog.author,
    title: updatedBlog.title,
    url: updatedBlog.url
  }
  
  await axios.put(baseUrl.concat('/').concat(updatedBlog._id),updateToSend)
  
}

const remove = async (id) => {

  const config = {
    headers: { 'Authorization': token }
  }

  await axios.delete(baseUrl.concat('/').concat(id),config )
}

export default { getAll, create, setToken, update, remove}