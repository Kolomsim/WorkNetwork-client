import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import axios from 'axios'

const FileUploadComponent = forwardRef((props, ref) => {
	const [selectedFile, setSelectedFile] = useState(null)
	const fileInputRef = useRef()

	const handleFileChange = event => {
		setSelectedFile(event.target.files[0])
	}

	const handleUpload = async () => {
		if (!selectedFile) {
			return null
		}

		const formData = new FormData()
		formData.append('file', selectedFile)

		try {
			const authToken = localStorage.getItem('accessToken')
			const userData = JSON.parse(localStorage.getItem('userData'))
			const userId = userData.id
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/files/${userId}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			)
			console.log('Ответ сервера загрузка файла:', response.data)
			return response.data.filePath
		} catch (error) {
			console.error('Ошибка при отправке файла:', error)
		}
	}

	const resetFileInput = () => {
		setSelectedFile(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	useImperativeHandle(ref, () => ({
		handleUpload: handleUpload,
		resetFileInput: resetFileInput,
	}))

	return (
		<div>
			<label className='file-label' htmlFor='file-input'>
				📎
			</label>
			<input
				className='file-input'
				id='file-input'
				type='file'
				onChange={handleFileChange}
				ref={fileInputRef}
			/>
		</div>
	)
})

export default FileUploadComponent
