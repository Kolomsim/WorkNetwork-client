import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import CreateGroup from '../CreateGroup/CreateGroup.jsx'

const Groups = () => {
	const [groups, setGroups] = useState([])
	const [showCreateGroup, setShowCreateGroup] = useState(false)

	useEffect(() => {
		const fetchGroups = async () => {
			const authToken = localStorage.getItem('accessToken')
			const userData = JSON.parse(localStorage.getItem('userData'))
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/groups`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			)
			setGroups(response.data)
		}
		fetchGroups()
	}, [])

	const handleCreateGroup = newGroup => {
		setGroups([...groups, newGroup])
		setShowCreateGroup(false)
	}

	return (
		<div className='groups-container'>
			<h1>Группы</h1>
			<button onClick={() => setShowCreateGroup(!showCreateGroup)}>
				{showCreateGroup ? 'Отмена' : 'Создать группу'}
			</button>
			{showCreateGroup && <CreateGroup onCreateGroup={handleCreateGroup} />}
			{groups.map(group => (
				<Link
					key={group._id}
					to={`/groups/${group._id}`}
					className='group-item'
				>
					<div className='groupInfo'>
						<img
							src={`${process.env.REACT_APP_API_URL}/${group.avatar}`}
							className='groupImg'
						/>
						<p className='group-link'>{group.name}</p>
					</div>
				</Link>
			))}
		</div>
	)
}

export default Groups
