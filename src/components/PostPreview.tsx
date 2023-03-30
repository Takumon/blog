import React from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
import PostMetaInfo from './PostMetaInfo'
import Image from './Thumbnail'
import config from '../config/blog-config'

const Card = styled.article`
  border-bottom: 1px solid var(--cardBorder);
  border-radius: 4px;
  box-shadow: var(--cardBS);
  padding: 0.75rem 1.75rem;
  background-color: var(--bgLight);
  max-width: 100%;

  @media screen and (max-width: 400px) {
    padding: 0.75rem 0.75rem;
  }
`

const Header = styled.div`
  overflow: hidden;
  margin-bottom: 0.75rem;
  margin-left: -1.75rem;
  margin-right: -1.75rem;
  margin-top: -0.75rem;

  @media screen and (max-width: 400px) {
    margin-bottom: 0.75rem;
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    margin-top: -0.75rem;
  }
`

const ImageWrapper = styled.div`
  transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
`

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 0.3em;
  font-size: 16px;
  border-bottom: 0;
  word-break: break-all;
  transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
  @media screen and (max-width: 400px) {
    line-height: 1.1;
  }
`

const Description = styled.p`
  color: var(--text);
  font-size: 12px;
  word-break: break-all;
  transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
`

const LinkCard = styled(Link)`
  box-shadow: none;
  color: var(--text);
  font-size: 1.2em;
  line-height: 1em;

  &:hover {
    box-shadow: none;
    opacity: 1;
    ${ImageWrapper} {
      transform: scale(1.04);
    }
    ${Title},
    ${Description} {
      color: var(--textHover);
    }
  }
  @media screen and (max-width: 400px) {
    font-size: 0.8em;
  }
`

const Body = styled.div`
  display: table-cell;
  vertical-align: middle;
  height: 5rem;
  padding: 0 0.5rem;

  @media screen and (max-width: 400px) {
    padding: 0 0.1rem;
  }
`

const styles = {
  image: css`
    object-fit: contain;
    width: 100%;
    max-height: 230px;
    height: 100%;
    margin: 0;
  `,
}

type Props = {
  postField: GatsbyTypes.MarkdownRemark
}

const PostPreview: React.FC<Props> = ({ postField }) => {
  return (
    <Card key={postField.frontmatter.slug}>
      <LinkCard to={postField.frontmatter.slug}>
        <Header>
          <ImageWrapper>
            <Image css={styles.image} filename={postField.frontmatter.thumbnail || config.defaultThumbnailImagePath} alt={'thumbnail'} />
          </ImageWrapper>
        </Header>
        <Body>
          <Title>{postField.frontmatter.title}</Title>
          <Description dangerouslySetInnerHTML={{ __html: postField.excerpt ?? '' }} />
          <PostMetaInfo tags={postField.frontmatter.tags ?? []} date={postField.frontmatter.date} />
        </Body>
      </LinkCard>
    </Card>
  )
}

export default PostPreview
