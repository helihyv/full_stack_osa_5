import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const Notification = ({message, isError}) => {
  if (message === null) {
    return null
  } 
  return (
    <div className={isError ? "error" : "notification"}>
      {message}
    </div>
  )
}


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      user: null,
      username: '',
      password: '',
      title: '',
      author: '',
      url: '',
      notification: null,
      notificationIsError: false
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
  } 

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  timedClearNotification = () => {
    setTimeout(() => {
      this.setState({
        notification: null,
        notificationIsError: false
      })
    }, 5000)
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      this.setState({
        username: '',
        password: '',
        user,
        notification: `user ${user.username} logged in`,
        notificationIsError: false
      })
      this.timedClearNotification()
    } catch(exception) {
      this.setState({
        notification: `wrong username or password`,
        notificationIsError: true
      }) 

      this.timedClearNotification()
    }
  }

    logout = (event) => {
      
      const username = this.state.user.username
      this.setState({
        user: null,
        notification: `user ${username} logged out`,
        notificationIsError: false
      })

      window.localStorage.removeItem('loggedBloglistUser')
      
      this.timedClearNotification()
    }

    createBlog = async (event) => {
      event.preventDefault()
       
      try{
        const newBlog =  await blogService.create({
          title: this.state.title,
          author: this.state.author,
          url: this.state.url
        })

        const blogList = this.state.blogs.concat(newBlog)
        
        this.setState({
          title:'',
          author: '',
          url: '',
          blogs: blogList,
          notification: `a new blog '${newBlog.title}' by ${newBlog.author} added`,
          notificationIsError: false
        })
        this.timedClearNotification() 
        
      } catch(exception) {
          this.setState({
            notification: `adding a new blog failed: ${exception}`,
            notificationIsError: true
          })
          this.timedClearNotification()

      }
      
     
    }

    

  render() {

    if (this.state.user === null) {
      return (
        <div>
        <Notification message={this.state.notification} isError={this.state.notificationIsError}/>
          <h2>Log in to application</h2>
          <form onSubmit={this.login}>
            <div>
              username
              <input
                name='username'
                type='text'
                value={this.state.username}
                onChange={this.handleFieldChange}
              />
            </div>
            <div>
              password
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleFieldChange}
              />
            </div>
            <button type="submit" >login</button>
          </form>
        </div>
      )
    }

    return (
      <div>
 
        <h2>blogs</h2>
        <Notification message={this.state.notification} isError={this.state.notificationIsError}/>
        <p> {this.state.user.username} logged in <button type="button" onClick={this.logout} >logout</button></p>
        <h3>create new</h3>
        <form onSubmit={this.createBlog} >
          <div>
            title
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleFieldChange}
            />
          </div>
          <div>
            author
            <input
              type="text"
              name="author"
              value={this.state.author}
              onChange={this.handleFieldChange}
            />
          </div>
          <div>
            url
            <input
              type="text"
              name="url"
              value={this.state.url}
              onChange={this.handleFieldChange}
            />
          </div>
          <button type="submit">create</button>
        </form>

        {this.state.blogs.map(blog => 
          <Blog key={blog._id} blog={blog}/>
        )}
      </div>
    );
  }
}

export default App;
