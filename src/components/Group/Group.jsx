import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

const Group = () => {
	const { id } = useParams()
	const [group, setGroup] = useState(null)
	const [currentUser, setCurrentUser] = useState(null)

	useEffect(() => {
		const authToken = localStorage.getItem('accessToken')
		const userId = localStorage.getItem('userId')
		const fetchGroup = async () => {
			try {
				const response = await axios.get(`http://localhost:4000/groups/${id}`, {
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				})
				setGroup(response.data)
				setCurrentUser(
					response.data.creator._id === userId ? 'creator' : 'member'
				)
			} catch (error) {
				console.error('Ошибка при загрузке группы:', error)
			}
		}
		fetchGroup()
	}, [id])

	const handleSubscribe = async () => {
		const userId = localStorage.getItem('userId')
		try {
			await axios.post(`http://localhost:4000/groups/${id}/subscribe`, {
				userId,
			})
		} catch (error) {
			console.error('Ошибка при подписке на группу:', error)
		}
	}

	const handleEditGroup = () => {
		console.log('Редактирование данных группы')
	}

	return (
		<div className='group-container'>
			{group ? (
				<>
					<img src={group.avatar} alt='Group Avatar' className='group-avatar' />
					<h1 className='group-title'>{group.name}</h1>
					<img src={group.header} alt='Group Header' className='group-header' />
					<p className='group-description'>{group.description}</p>
					<p className='group-admin'>
						Admin:{' '}
						<Link to={`/user/${group.creator._id}`}>
							{group.creator.username}
						</Link>
					</p>
					{currentUser === 'creator' ? (
						<button className='edit-group-button' onClick={handleEditGroup}>
							Редактировать данные группы
						</button>
					) : (
						<button className='subscribe-button' onClick={handleSubscribe}>
							Подписаться
						</button>
					)}
				</>
			) : (
				<p>Загрузка...</p>
			)}
		</div>
	)
}

export default Group
