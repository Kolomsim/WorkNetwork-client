import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import FileUploadComponent from '../FileUpload/FileUpload.jsx'

const CreateForum = ({ onCreateForum }) => {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		creator: '',
	})
	const [authToken, setAuthToken] = useState('')
	const fileUploadRef = useRef()

	useEffect(() => {
		const token = localStorage.getItem('accessToken')
		const userData = JSON.parse(localStorage.getItem('userData'))

		if (token && userData) {
			setAuthToken(token)
			setFormData(prevState => ({
				...prevState,
				creator: userData.id,
			}))
		}
	}, [])

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prevState => ({
			...prevState,
			[name]: value,
		}))
	}

	const handleSubmit = async () => {
		try {
			let fileId = ''
			if (fileUploadRef.current && fileUploadRef.current.handleUpload) {
				fileId = await fileUploadRef.current.handleUpload()
			}

			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/forums`,
				{ ...formData, attachments: fileId ? [fileId] : [] },
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			)
			onCreateForum(response.data)
			setFormData({
				title: '',
				description: '',
				creator: formData.creator,
			})
			if (fileUploadRef.current) {
				fileUploadRef.current.resetFileInput()
			}
		} catch (error) {
			console.error('Ошибка при создании форума:', error)
			alert('Произошла ошибка при создании форума.')
		}
	}

	return (
		<div>
			<form className='create-forum-form'>
				<input
					type='text'
					name='title'
					value={formData.title}
					onChange={handleChange}
					placeholder='Название форума'
					required
				/>
				<textarea
					name='description'
					value={formData.description}
					onChange={handleChange}
					placeholder='Описание форума'
					required
				/>
				<FileUploadComponent ref={fileUploadRef} />
			</form>
			<button onClick={handleSubmit}>Отправить</button>
		</div>
	)
}

export default CreateForum
