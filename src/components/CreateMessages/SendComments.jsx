import React from 'react'
import MessageSend from './CreateMessage.jsx'

function CommentSend({ forumId, onCreateComment, replyingTo }) {
	const url = `${process.env.REACT_APP_API_URL}/forums/${forumId}/comments`

	return (
		<MessageSend
			url={url}
			onCreateMessage={onCreateComment}
			placeholder='Введите комментарий...'
			additionalData={{ forumId, parentId: replyingTo }}
		/>
	)
}

export default CommentSend
