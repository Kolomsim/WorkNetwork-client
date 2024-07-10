import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CreateGroup = ({ onCreateGroup }) => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [creatorId, setCreatorId] = useState('')

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('userData'))
		if (userData && userData.id) {
			setCreatorId(userData.id)
		}
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()
		const authToken = localStorage.getItem('accessToken')
		try {
			const response = await axios.post(
				`${import.meta.env.REACT_APP_API_URL}/groups`,
				{
					name,
					description,
					creator: creatorId,
				},
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			)
			onCreateGroup(response.data)
		} catch (error) {
			console.error('Ошибка при создании группы:', error)
		}
	}

	return (
		<div className='create-group-container'>
			<h2>Создать группу</h2>
			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label>Название группы</label>
					<input
						type='text'
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
				</div>
				<div className='form-group'>
					<label>Описание</label>
					<textarea
						value={description}
						onChange={e => setDescription(e.target.value)}
						required
					/>
				</div>
				<button type='submit'>Создать</button>
			</form>
		</div>
	)
}

export default CreateGroup
