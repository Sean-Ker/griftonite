"use client"

import React from 'react'

const PostBlog = ({callback}) => {
  return (
    <button onClick={callback}>Post to contract</button>
  )
}

export default PostBlog
