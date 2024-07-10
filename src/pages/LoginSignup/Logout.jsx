import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function LoginPage() {
	const navigate = useNavigate()
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await axios.post(
				`${import.meta.env.REACT_APP_API_URL}/auth/logout`,
				formData
			)
			console.log('Ответ сервера signup:', response.data)
			localStorage.setItem('accessToken', '')
			localStorage.setItem('userData', '')
			const loggedIn = localStorage.getItem('accessToken')
			if (!loggedIn) {
				return navigate('/auth/login')
			}
		} catch (error) {
			console.error('Ошибка при отправке запроса:', error)
		}
	}

	if (!localStorage.getItem('accessToken')) {
		console.log('Токен доступа отсутствует в localStorage')
	} else {
		console.log('Токен доступа присутствует в localStorage')
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
					<Link to='/auth/signup	'>
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
