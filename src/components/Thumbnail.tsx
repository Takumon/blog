import React from 'react'
import Img from 'gatsby-image'
import useThumbnailImage from '../hooks/useThumbnailImage'

type Props = {
  filename: string
  alt: string
}

const Thumbnail: React.FC<Props> = ({ filename, alt }) => {
  const fluidImage = useThumbnailImage(filename)
  return fluidImage ? <Img alt={alt} fluid={fluidImage} /> : null
}

export default Thumbnail
