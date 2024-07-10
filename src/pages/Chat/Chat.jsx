import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ListOfChats from '../../components/ListOfChats/ListOfChats.jsx'
import CreateChat from '../../components/CreateChat/CreateChat.jsx'
import Messages from '../../components/Messages/Messages.jsx'
import ChatMessageSend from '../../components/CreateMessages/SendMessage.jsx'

export default function Chat() {
	const [selectedChatId, setSelectedChatId] = useState('')
	const [selectedChatName, setSelectedChatName] = useState('')
	const [createdNewChat, setCreatedNewChat] = useState(null)
	const [createdNewMessage, setCreatedNewMessage] = useState(null)
	const [chats, setChats] = useState([])

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const authToken = localStorage.getItem('accessToken')
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/chats`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				)
				setChats(response.data)
			} catch (error) {
				console.error('Ошибка при загрузке чатов:', error)
			}
		}
		fetchChats()
	}, [])

	const handleChatSelection = (chatId, chatName) => {
		setSelectedChatId(chatId)
		setSelectedChatName(chatName)
	}

	const handleChatCreate = newChatInfo => {
		setCreatedNewChat(newChatInfo)
	}

	const handleMessageCreate = newMessageInfo => {
		setCreatedNewMessage(newMessageInfo)
	}

	return (
		<div className='mainPage'>
			<div className='listOfChats'>
				<div className='createChatButton'>
					<CreateChat onCreateChat={handleChatCreate} />
				</div>
				<h2>Список чатов:</h2>
				<ListOfChats
					chats={chats}
					onSelectChat={handleChatSelection}
					createdNewChat={createdNewChat}
				/>
			</div>

			<div className='dialog'>
				{selectedChatId ? (
					<div className='messagesBox'>
						<div className='chatHeader'>
							<h1>{selectedChatName}</h1>
						</div>
						<Messages
							recievedChatId={selectedChatId}
							recievedNewMessage={createdNewMessage}
						/>
					</div>
				) : (
					'Выберите диалог для начала общения'
				)}
				<div className='sendBox'>
					{selectedChatId && (
						<ChatMessageSend
							chatId={selectedChatId}
							onCreateMessage={handleMessageCreate}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
