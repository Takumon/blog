import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import useThumbnailImage from '../hooks/useThumbnailImage'

type Props = {
  filename: string
  alt: string
}

const Thumbnail: React.FC<Props> = ({ filename, alt }) => {
  const fluidImage = useThumbnailImage(filename)
  return fluidImage ? <GatsbyImage alt={alt} image={fluidImage} /> : null
}

export default Thumbnail
