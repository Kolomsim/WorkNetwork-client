import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function LoginPage({ setAuthenticated }) {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	})
	const navigate = useNavigate()

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/login`,
				formData
			)
			console.log(`${import.meta.env.VITE_API_URL}`)
			console.log('Ответ сервера login:', response.data)
			localStorage.setItem('accessToken', response.data.accessToken)
			const userData = {
				id: response.data._id,
				username: response.data.username,
			}
			localStorage.setItem('userData', JSON.stringify(userData))
			setAuthenticated(true)
			navigate('/chats')
		} catch (error) {
			console.error('Ошибка при отправке запроса:', error)
		}
	}

	return (
		<div className='LoginBlock'>
			<div className='LoginInfoBlock'>
				<h1>Добро пожаловать в WorkNetwork!</h1>
				<p>
					Пожалуйста, войдите в свой аккаунт, чтобы продолжить общение с
					друзьями и коллегами.
				</p>
			</div>
			<div className='loginOrRegister'>
				<form className='LoginForm' onSubmit={handleSubmit}>
					<input
						type='text'
						name='username'
						value={formData.username}
						onChange={handleChange}
						placeholder='Логин'
					/>
					<input
						type='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						placeholder='Пароль'
					/>
					<button type='submit'>Отправить</button>
				</form>
				<div className='goToRegister'>
					<Link to='/auth/signup'>
						<button>Зарегистрироваться</button>
					</Link>
					<p>
						После регистрации вы получите доступ ко всем возможностям
						WorkNetwork!
					</p>
				</div>
			</div>
		</div>
	)
}
