import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ListOfChats = ({ onSelectChat, createdNewChat }) => {
	const handleChatClick = (chatId, chatname) => {
		onSelectChat(chatId, chatname)
	}

	useEffect(() => {
		if (createdNewChat) {
			setChats(prevChats =>
				prevChats ? [...prevChats, createdNewChat] : [createdNewChat]
			)
		}
	}, [createdNewChat])

	const [chats, setChats] = useState(null)

	useEffect(() => {
		const getAllChats = async () => {
			try {
				const authToken = localStorage.getItem('accessToken')
				const userData = JSON.parse(localStorage.getItem('userData'))
				const response = await axios.get(`http://localhost:4000/chats`, {
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
					params: {
						userId: userData.id,
					},
				})
				setChats(response.data)
			} catch (error) {
				console.error('Ошибка при отправке запроса:', error)
			}
		}
		getAllChats()
	}, [])

	return (
		<div className='chatsContainer'>
			{chats ? (
				chats.map(chat => (
					<div
						className='chatCard'
						key={chat._id}
						onClick={() => handleChatClick(chat._id, chat.chatname)}
					>
						<h3>{chat.chatname}</h3>
					</div>
				))
			) : (
				<p>Нет начатых чатов</p>
			)}
		</div>
	)
}

export default ListOfChats
