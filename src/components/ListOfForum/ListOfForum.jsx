import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import CreateForum from '../CreateForum/CreateForum.jsx'

const Forum = ({ currentUser }) => {
	const [forums, setForums] = useState([])
	const [showCreateForum, setShowCreateForum] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [filteredForums, setFilteredForums] = useState([])

	useEffect(() => {
		const authToken = localStorage.getItem('accessToken')
		const fetchForums = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/forums`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				)
				setForums(response.data)
				setFilteredForums(response.data)
			} catch (error) {
				console.error('Ошибка при загрузке форумов:', error)
			}
		}
		fetchForums()
	}, [])

	const handleCreateForum = newForum => {
		setForums([...forums, newForum])
		setFilteredForums([...forums, newForum])
		setShowCreateForum(false)
	}

	const handleSearch = event => {
		const query = event.target.value
		setSearchQuery(query)

		const filtered = forums.filter(
			forum =>
				forum.title.toLowerCase().includes(query.toLowerCase()) ||
				forum.description.toLowerCase().includes(query.toLowerCase())
		)
		setFilteredForums(filtered)
	}

	return (
		<div className='forums-container'>
			<h2>Форумы</h2>
			<div className='forumSettings'>
				<input
					type='text'
					placeholder='Поиск по названию и описанию'
					value={searchQuery}
					onChange={handleSearch}
					className='search-input'
				/>
				<button
					className='create-forum-button'
					onClick={() => setShowCreateForum(!showCreateForum)}
				>
					{showCreateForum ? 'Отмена' : 'Создать форум'}
				</button>
			</div>
			{showCreateForum && (
				<div className='create-forum-form'>
					<CreateForum onCreateForum={handleCreateForum} />
				</div>
			)}

			{filteredForums.map(forum => (
				<div key={forum._id} className='forum-item'>
					<Link to={`/forums/${forum._id}`}>
						<h3>{forum.title}</h3>
					</Link>
					<p>{forum.description}</p>
				</div>
			))}
		</div>
	)
}

export default Forum
