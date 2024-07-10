import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
	const userData = JSON.parse(localStorage.getItem('userData'))
	const userLink = userData.username

	return (
		<div className='sidebar'>
			<ul>
				<li>
					<Link to={`/user/${userLink}`}>Мой профиль</Link>
				</li>
				<li>
					<Link to='/chats'>Чаты</Link>
				</li>
				{/* <li>
					<Link to='/groups'>Сообщества</Link> //в разработке
				</li> */}
				<li>
					<Link to='/forum'>Форумы</Link>
				</li>
				<li>
					<Link to='/job-search'>Поиск работы</Link>
				</li>
			</ul>
		</div>
	)
}

export default Sidebar
