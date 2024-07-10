import React from 'react'
import MessageSend from './CreateMessage.jsx'

function ChatMessageSend({ chatId, onCreateMessage }) {
	const url = `${import.meta.env.VITE_API_URL}/chats/${chatId}/messages`

	return (
		<MessageSend
			url={url}
			onCreateMessage={onCreateMessage}
			placeholder='Введите сообщение...'
			additionalData={{ chatId }}
		/>
	)
}

export default ChatMessageSend
