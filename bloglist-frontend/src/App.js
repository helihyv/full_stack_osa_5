import React from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import PropTypes from 'prop-types'

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

const DeleteButton = ({onClick,blog,user}) => {

  if (blog.user && user && blog.user.username !== user.username) {
    return null
  } else {
    return (<button type="button" onClick={onClick} >delete</button>)
  }
}

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  blog: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string
    })
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string
  }).isRequired
}

class BlogItem extends React.Component {
  constructor(props) {
    super(props)
    this.state =
    {
      blog: props.blog,
      showFullInfo: false,
      deleteFunction: props.deleteFunction,
      currentUser: props.currentUser
    }
  }

  toggleFullInfo = () => {
    this.setState({
      showFullInfo: !this.state.showFullInfo
    })
  }

  addLike = async () => {
    const blog = this.state.blog
    blog.likes += 1
    
    try {
      await blogService.update(blog)
      this.setState({
        blog: blog
      })
    } catch (exception) {
        console.log(exception)
    }
  }

  handleDelete = () => {
 
    this.state.deleteFunction(this.state.blog)
  }

  render() {
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    const showWhenFullInfo= {
      display: this.state.showFullInfo ? '' :'none',
      paddingTop: 5,
      paddingLeft: 15 
    }

        const userInfo= this.state.blog.user ? this.state.blog.user.name : ""
        
    return (
      <div style={blogStyle} >
        <div onClick={this.toggleFullInfo}>
         {this.state.blog.title}: {this.state.blog.author}
        </div>
        <div style={showWhenFullInfo}>
          <a href={this.state.blog.url} >{this.state.blog.url}</a><br/>
          {this.state.blog.likes} likes <button type="button" onClick={this.addLike}>like</button><br/>
          added by {userInfo}<br/>
          <DeleteButton onClick={this.handleDelete} blog={this.state.blog} user={this.state.currentUser}/>

        </div>  
      </div>
    )

  }
}

BlogItem.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    })
  }).isRequired,
  deleteFunction:PropTypes.func.isRequired, 
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }).isRequired
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

    deleteBlog = async(blog) => {
      try {

        if (window.confirm(`Delete '${blog.title}' by ${blog.author}?`)) {
        
          await blogService.remove(blog._id)
  
          console.log("Poisto palvelimelta onnistui")
  
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
          .sort((blog_a,blog_b) => {return blog_b.likes - blog_a.likes})
          .map(blog => 
            <BlogItem key={blog._id} blog={blog} deleteFunction={this.deleteBlog} currentUser={this.state.user}/>
        )}
      </div>
    );
  }
}

export default App;
