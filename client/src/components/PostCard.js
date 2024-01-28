import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Card, Image, Button, Icon, Label } from 'semantic-ui-react'
import moment from 'moment'
import LikeButton from './LikeButton.js'
import DeleteButton from './DeleteButton.js'
import { AuthContext } from '../context/auth'
import MyPopup from '../util/MyPopup.js'

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) {
  const { user } = useContext(AuthContext)
  // eslint-disable-next-line
  function likePost() {
    console.log('Like Post')
  }

  // eslint-disable-next-line
  function commentOnPost() {
    console.log('Comment of post')
  }

  return (
    <Card fluid>
      <Card.Content as={Link} to={`/posts/${id}`}>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <MyPopup content="Comment on post">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  )
}

export default PostCard
