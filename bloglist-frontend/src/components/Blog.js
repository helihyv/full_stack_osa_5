import React from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

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
  
class Blog extends React.Component {
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

      this.props.sortBlogsFunction()

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
          <div onClick={this.toggleFullInfo} className="nameAndAuthor">
           {this.state.blog.title}: {this.state.blog.author}
          </div>
          <div style={showWhenFullInfo} className="details">
            <a href={this.state.blog.url} >{this.state.blog.url}</a><br/>
            {this.state.blog.likes} likes <button type="button" onClick={this.addLike}>like</button><br/>
            added by {userInfo}<br/>
            <DeleteButton onClick={this.handleDelete} blog={this.state.blog} user={this.state.currentUser}/>
  
          </div>  
        </div>
      )
  
    }
  }
  
  Blog.propTypes = {
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

  export default Blog