import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Messages.css'

function Messages({ recievedChatId, recievedNewMessage }) {
	const [messages, setMessages] = useState([])
	const [usersData, setUsersData] = useState({})
	const [messageToDelete, setMessageToDelete] = useState(null)

	const userData = JSON.parse(localStorage.getItem('userData'))
	const userId = userData.id

	useEffect(() => {
		const getUsersData = async () => {
			try {
				const authToken = localStorage.getItem('accessToken')
				const userIds = Array.from(
					new Set(messages.map(message => message.creatorId))
				)
				const userPromises = userIds.map(async id => {
					const res = await axios.get(
						`${import.meta.env.REACT_APP_API_URL}/user/id/${id}`,
						{
							headers: {
								Authorization: `Bearer ${authToken}`,
							},
						}
					)
					return {
						id: id,
						fullname: res.data.fullname,
						avatar: res.data.avatar,
					}
				})
				const users = await Promise.all(userPromises)
				const userMap = {}
				users.forEach(user => {
					userMap[user.id] = {
						fullname: user.fullname,
						avatar: user.avatar,
					}
				})
				setUsersData(userMap)
			} catch (error) {
				console.error('Ошибка при получении данных пользователей:', error)
			}
		}

		if (messages.length > 0) {
			getUsersData()
		}
	}, [messages])

	useEffect(() => {
		const getAllChatMessages = async () => {
			try {
				const authToken = localStorage.getItem('accessToken')
				const response = await axios.get(
					`http://localhost:4000/chats/${recievedChatId}/messages`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				)
				setMessages(response.data)
				console.log(response.data)
			} catch (error) {
				console.error('Ошибка при отправке запроса:', error)
			}
		}

		if (recievedChatId) {
			getAllChatMessages()
		}

		const interval = setInterval(getAllChatMessages, 5000)
		return () => clearInterval(interval)
	}, [recievedChatId])

	useEffect(() => {
		if (recievedNewMessage) {
			setMessages(prevMessages => [...prevMessages, recievedNewMessage])
		}
	}, [recievedNewMessage])

	const getAttachmentType = attachment => {
		if (!attachment) {
			return null
		}
		const pathSegments = attachment.split('/')
		const directory = pathSegments[pathSegments.length - 2]
		switch (directory) {
			case 'images':
				return 'image'
			case 'videos':
				return 'video'
			default:
				return 'file'
		}
	}

	const deleteMessage = async messageId => {
		try {
			const authToken = localStorage.getItem('accessToken')
			await axios.delete(`http://localhost:4000/messages/${messageId}`, {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			})
			setMessages(prevMessages =>
				prevMessages.filter(message => message._id !== messageId)
			)
		} catch (error) {
			console.error('Ошибка при удалении сообщения:', error)
		}
	}

	function formatDate(timestamp) {
		const date = new Date(timestamp)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')

		return `${hours}:${minutes} <br> ${year}-${month}-${day}`
	}

	const handleDeleteConfirmation = messageId => {
		setMessageToDelete(messageId)
	}

	const handleDeleteCancel = () => {
		setMessageToDelete(null)
	}

	const handleDeleteConfirm = async () => {
		try {
			await deleteMessage(messageToDelete)
			setMessageToDelete(null)
		} catch (error) {
			console.error('Ошибка при удалении сообщения:', error)
		}
	}

	return (
		<div className='messagesScroll'>
			<div className='messagesContainer'>
				{messages.length > 0 ? (
					messages.map(message => (
						<div
							className={`messageCard ${
								message.creatorId === userId ? 'myMessage' : 'otherMessage'
							}`}
							key={message._id}
						>
							{usersData[message.creatorId] && (
								<>
									<div className='userData'>
										<img
											className='userProfPic'
											src={`${usersData[message.creatorId].avatar}`}
											alt='User Avatar'
										/>
										<h3>{usersData[message.creatorId].fullname}</h3>
									</div>

									<div className='messageContent'>
										<p>{message.content}</p>
										<div className='attachmentContainer'>
											{message.attachments &&
												message.attachments.length > 0 &&
												message.attachments.map((attachment, index) => (
													<React.Fragment key={attachment}>
														{attachment &&
															getAttachmentType(attachment) === 'image' && (
																<img
																	src={`http://localhost:4000/${attachment}`}
																	alt={`Image ${index + 1}`}
																	className='attachment'
																/>
															)}
														{attachment &&
															getAttachmentType(attachment) === 'video' && (
																<video
																	src={`http://localhost:4000/${attachment}`}
																	controls
																	className='attachment'
																/>
															)}
														{attachment &&
															getAttachmentType(attachment) === 'file' && (
																<a
																	href={`http://localhost:4000/${attachment}`}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='attachment'
																>
																	Download File {index + 1}
																</a>
															)}
													</React.Fragment>
												))}
										</div>
										<div className='messageDate'>
											<p
												dangerouslySetInnerHTML={{
													__html: formatDate(message.createdAt),
												}}
											></p>
										</div>
										{message.sender === userId && (
											<button
												className='deleteButton'
												onClick={() => handleDeleteConfirmation(message._id)}
											>
												X
											</button>
										)}
									</div>
								</>
							)}
						</div>
					))
				) : (
					<p>Начните диалог</p>
				)}
			</div>
			{messageToDelete && (
				<div className='modal'>
					<div className='modal-content'>
						<p>Вы уверены, что хотите удалить это сообщение?</p>
						<div>
							<button onClick={handleDeleteConfirm}>Да</button>
							<button onClick={handleDeleteCancel}>Отмена</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Messages
