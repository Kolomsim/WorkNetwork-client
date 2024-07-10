import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		confirmPassword: '',
		email: '',
		fullname: '',
	})
	const navigate = useNavigate()
	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/auth/signup`,
				formData
			)
			console.log('Ответ сервера signup:', response.data)
			localStorage.setItem('accessToken', response.data.accessToken)
			const userData = {
				id: response.data._id,
				username: response.data.username,
			}
			localStorage.setItem('userData', JSON.stringify(userData))
			const loggedIn = localStorage.getItem('accessToken')
			if (loggedIn) {
				return navigate('/chats')
			}
			console.log('Ответ сервера register:', response.data)
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
						placeholder='Логин'
						value={formData.username}
						onChange={handleChange}
					/>
					<input
						type='text'
						name='fullname'
						placeholder='Имя'
						value={formData.fullname}
						onChange={handleChange}
					/>
					<input
						type='email'
						name='email'
						placeholder='Email'
						value={formData.email}
						onChange={handleChange}
					/>
					<input
						type='password'
						name='password'
						placeholder='Пароль'
						value={formData.password}
						onChange={handleChange}
					/>
					<input
						type='password'
						name='confirmPassword'
						placeholder='Подтвердите пароль'
						value={formData.confirmPassword}
						onChange={handleChange}
					/>
					<button type='submit'>Регистрация</button>
				</form>
				<div className='goToLogin'>
					<Link to='/auth/login'>
						<button>Войти</button>
					</Link>
					<p>Уже есть аккаунт в WorkNetwork? Войдите в него!</p>
				</div>
			</div>
		</div>
	)
}
