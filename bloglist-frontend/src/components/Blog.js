import React from 'react'
import PropTypes from 'prop-types'

const Blog = ({blog}) => (
  <div>
    {blog.title} {blog.author}
  </div>  
)



export default Blog