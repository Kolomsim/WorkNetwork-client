import React, { useState, useRef } from 'react'
import axios from 'axios'
import Picker from 'emoji-picker-react'
import FileUpload from '../FileUpload/FileUpload.jsx'

function MessageSend({ url, onCreateMessage, placeholder, additionalData }) {
	const fileUploadRef = useRef(null)
	const messageInputRef = useRef(null)
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const userData = JSON.parse(localStorage.getItem('userData'))
	const creatorId = userData.id
	const [newMessage, setNewMessage] = useState({
		content: '',
		creatorId: creatorId,
		parentId: null,
		attachments: [],
		...additionalData,
	})

	const handleEmojiClick = (event, emojiObject) => {
		setNewMessage(prevMessage => ({
			...prevMessage,
			content: prevMessage.content + emojiObject.emoji,
		}))
		messageInputRef.current.focus()
	}

	const handleChange = e => {
		const { name, value } = e.target
		setNewMessage(prevMessage => ({
			...prevMessage,
			[name]: value,
		}))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			let attachments = []
			const textMessage = newMessage.content.trim()
			if (fileUploadRef.current && fileUploadRef.current.handleUpload) {
				const filePath = await fileUploadRef.current.handleUpload()
				if (filePath) {
					attachments.push(filePath)
				}
			}

			if (textMessage || attachments.length > 0) {
				await sendNewMessage(textMessage, attachments)
			}

			if (messageInputRef.current) {
				messageInputRef.current.value = ''
				setNewMessage(prevMessage => ({
					...prevMessage,
					content: '',
				}))
			}

			if (fileUploadRef.current) {
				fileUploadRef.current.resetFileInput()
			}
		} catch (error) {
			console.error('Ошибка при отправке сообщения:', error)
		}
	}

	const sendNewMessage = async (textMessage, attachments = []) => {
		try {
			const authToken = localStorage.getItem('accessToken')
			const messageData = {
				content: textMessage,
				creatorId: newMessage.creatorId,
				parentId: newMessage.parentId,
				attachments: attachments,
				...additionalData,
			}
			const response = await axios.post(url, messageData, {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			})
			onCreateMessage(response.data)
		} catch (error) {
			console.error('Ошибка при отправке запроса:', error)
		}
	}

	const toggleEmojiPicker = () => {
		setShowEmojiPicker(prevState => !prevState)
	}

	return (
		<div className='sendBox'>
			{showEmojiPicker && (
				<div
					className='emoji-picker-wrapper'
					onMouseEnter={() => setShowEmojiPicker(true)}
					onMouseLeave={() => setShowEmojiPicker(false)}
				>
					<Picker
						onEmojiClick={handleEmojiClick}
						emojiStyle='apple'
						lazyLoadEmojis={true}
						skinTonesDisabled={false}
						searchDisabled={false}
					/>
				</div>
			)}
			<form className='createMessage' onSubmit={handleSubmit}>
				<FileUpload ref={fileUploadRef} />
				<input
					type='text'
					name='content'
					id='content'
					value={newMessage.content}
					onChange={handleChange}
					ref={messageInputRef}
					placeholder={placeholder}
				/>
				<button
					id='emojiPickerButton'
					type='button'
					onClick={toggleEmojiPicker}
				>
					😀
				</button>
				<button type='submit' className='sendButton'>
					►
				</button>
			</form>
		</div>
	)
}

export default MessageSend
