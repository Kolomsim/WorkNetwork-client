import React, { useState } from 'react'
import axios from 'axios'

const CreateChatModal = ({ onCreateChat, onClose }) => {
	const authToken = localStorage.getItem('accessToken')
	const userData = JSON.parse(localStorage.getItem('userData'))
	const [newChat, setNewChat] = useState({
		chatname: '',
		chatType: 'group',
		creator: userData.id,
		participants: [],
	})

	const [newParticipant, setNewParticipant] = useState('')
	const [participantUsernames, setParticipantUsernames] = useState([])
	const [participantFullnames, setParticipantFullnames] = useState([])
	const [showTooltip, setShowTooltip] = useState(false)

	const handleChange = e => {
		const { name, value } = e.target
		setNewChat({ ...newChat, [name]: value })
	}

	const handleAddParticipant = async () => {
		if (newParticipant.trim() !== '') {
			try {
				const response = await axios.get(
					`${import.meta.env.REACT_APP_API_URL}/user/login/${newParticipant}`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				)
				console.log('Response data:', response.data)
				const { id, username, fullname } = response.data
				if (id) {
					setNewChat(prevState => ({
						...prevState,
						participants: [...prevState.participants, id],
					}))

					setParticipantUsernames(prevState => [...prevState, username])

					setParticipantFullnames(prevState => [...prevState, fullname])

					setNewParticipant('')
				} else {
					alert('Пользователь с таким логином не найден.')
				}
			} catch (error) {
				console.error('Ошибка при отправке запроса:', error)
				alert('Произошла ошибка при поиске пользователя.')
			}
		}
	}

	const handleRemoveParticipant = participant => {
		const index = newChat.participants.indexOf(participant)
		const updatedParticipants = newChat.participants.filter(
			p => p !== participant
		)
		const updatedUsernames = participantUsernames.filter(
			(_, idx) => idx !== index
		)
		const updatedFullnames = participantFullnames.filter(
			(_, idx) => idx !== index
		)
		setNewChat(prevState => ({
			...prevState,
			participants: updatedParticipants,
		}))
		setParticipantUsernames(updatedUsernames)
		setParticipantFullnames(updatedFullnames)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		let chatName = newChat.chatname
		if (chatName.trim() === '') {
			chatName = participantFullnames.join(' ')
			setNewChat({ ...newChat, chatname: chatName })
		}
		try {
			const response = await axios.post(
				`${import.meta.env.REACT_APP_API_URL}/chats`,
				{ ...newChat, chatname: chatName },
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			)
			onCreateChat(response.data)
			onClose()
		} catch (error) {
			console.error('Ошибка при отправке запроса:', error)
			alert('Произошла ошибка при создании чата.')
		}
	}

	return (
		<div className='modalchat-overlay' onClick={onClose}>
			<div className='modalchat' onClick={e => e.stopPropagation()}>
				<h2>Новый чат</h2>
				<form className='formContainer' onSubmit={handleSubmit}>
					<button className='close-button' onClick={onClose}>
						×
					</button>
					<input
						type='text'
						name='chatname'
						id='chatname'
						value={newChat.chatname}
						onChange={handleChange}
						placeholder='Название чата'
					/>
					<fieldset>
						<legend>Выберите тип чата:</legend>

						<div>
							<input
								type='radio'
								id='group'
								name='chatType'
								value='group'
								checked={newChat.chatType === 'group'}
								onChange={handleChange}
							/>
							<label htmlFor='group'>Группа</label>
						</div>

						<div>
							<input
								type='radio'
								id='channel'
								name='chatType'
								value='channel'
								checked={newChat.chatType === 'channel'}
								onChange={handleChange}
							/>
							<label htmlFor='channel'>Канал</label>
						</div>
					</fieldset>
					<label htmlFor='participants'>
						Добавить участников{' '}
						<span
							className='tooltip'
							onMouseEnter={() => setShowTooltip(true)}
							onMouseLeave={() => setShowTooltip(false)}
						>
							?
							{showTooltip && (
								<span className='tooltip-text'>
									Добавление пользователей осуществляется по их username,
									который можно узнать на форуме, либо у других пользователей.
								</span>
							)}
						</span>
					</label>
					<div className='participantsContainer'>
						<input
							type='text'
							name='participants'
							id='participants'
							value={newParticipant}
							onChange={e => setNewParticipant(e.target.value)}
							placeholder='Введите имя участника'
						/>
						<button type='button' onClick={handleAddParticipant}>
							Добавить
						</button>
					</div>

					<div>
						{participantUsernames.map((username, index) => (
							<div className='participantItem' key={index}>
								<span>{username}</span>
								<button
									type='button'
									className='removeParticipantButton deleteUser'
									onClick={() =>
										handleRemoveParticipant(newChat.participants[index])
									}
								>
									Удалить
								</button>
							</div>
						))}
					</div>

					<button type='submit'>Создать чат</button>
				</form>
			</div>
		</div>
	)
}

const ChatForm = ({ onCreateChat }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen)
	}

	return (
		<div>
			<button
				onClick={toggleModal}
				style={{ width: '100%', boxSizing: 'border-box', marginBottom: '30px' }}
			>
				{isModalOpen ? 'Отмена' : 'Новый чат'}
			</button>
			{isModalOpen && (
				<CreateChatModal onCreateChat={onCreateChat} onClose={toggleModal} />
			)}
		</div>
	)
}

export default ChatForm
