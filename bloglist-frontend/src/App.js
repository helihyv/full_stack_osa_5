import React from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import PropTypes from 'prop-types'
import Blog from './components/Blog'

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

Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool.isRequired
}



class Togglable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({visible: !this.state.visible})
  }

  render() {
    const hideWhenvisible = { display: this.state.visible ? 'none': '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenvisible}>
          <button onClick= {this.toggleVisibility}>{this.props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
          {this.props.children}
          <button onClick={this.toggleVisibility}>cancel</button>
        </div>
      </div>
    )
  }
}

const BlogForm = ({onSubmit, handleChange, title, author, url}) => {
  return (
  <div> 
    <h3>create new</h3>
    <form onSubmit={onSubmit} >
      <div>
        title
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </div>
      <div>
        author
        <input
          type="text"
          name="author"
          value={author}
          onChange={handleChange}
        />
      </div>
      <div>
        url
        <input
          type="text"
          name="url"
          value={url}
          onChange={handleChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  </div> 

  )
}

BlogForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
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
    const blogs = blogService.getAll().then((blogs) => {
      blogs.sort((blog_a,blog_b) => blog_b.likes - blog_a.likes)
      this.setState({ blogs })

    })
  
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

    deleteBlog = async(blog) => {
      try {

        if (window.confirm(`Delete '${blog.title}' by ${blog.author}?`)) {
        
          await blogService.remove(blog._id)
   
          const blogs = this.state.blogs
          blogs.splice(blogs.indexOf(blog),1)
          this.setState( {
            blogs: blogs,
            notification: `the blog '${blog.title}' by ${blog.author} deleted`,
            notificationIsError: false
          })
          this.timedClearNotification()
        }
  
      } catch (exception) {
        this.setState({
          notification: `deleting the blog '${blog.title}' by ${blog.author} failed: ${exception}`,
          notificationIsError: true
        })
        this.timedClearNotification()
      }
    }


    sortBlogs = () => {
      console.log(this.state.blogs)
      const blogs=this.state.blogs 
      blogs.sort((blog_a,blog_b) => {return blog_b.likes - blog_a.likes})

      this.setState({
        blogs
      })
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

        <Togglable buttonLabel='new blog' >
          <BlogForm
            onSubmit={this.createBlog}
            handleChange={this.handleFieldChange}
            title={this.state.title}
            author={this.state.author}
            url={this.state.url}
          />
        </Togglable>

        {this.state.blogs
          .map(blog => 
            <Blog key={blog._id} blog={blog} deleteFunction={this.deleteBlog} sortBlogsFunction={this.sortBlogs} currentUser={this.state.user}/>
        )}
      </div>
    );
  }
}

export default App;
