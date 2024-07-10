import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import FileUpload from '../../components/FileUpload/FileUpload.jsx'

const UserProfile = () => {
	const [userInfo, setUserInfo] = useState(null)
	const [editMode, setEditMode] = useState(false)
	const [profileData, setProfileData] = useState({
		fullname: '',
		avatar: null,
		education: '',
		contacts: '',
		dateOfBirth: '',
		workExperience: '',
		additionalInfo: '',
	})

	const { username: currentProfileLink } = useParams()
	const authToken = localStorage.getItem('accessToken')
	const fileUploadRef = useRef(null)
	const apiUrl = import.meta.env.REACT_APP_API_URL

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const response = await axios.get(
					`${apiUrl}/user/${currentProfileLink}`,
					{ headers: { Authorization: `Bearer ${authToken}` } }
				)
				setUserInfo(response.data)
				setProfileData({
					fullname: response.data.fullname,
					avatar: response.data.avatar,
					education: response.data.education || '',
					contacts: response.data.contacts || '',
					dateOfBirth: response.data.dateOfBirth || '',
					workExperience: response.data.workExperience || '',
					additionalInfo: response.data.additionalInfo || '',
				})
			} catch (error) {
				console.error('Error fetching user information:', error)
			}
		}
		getUserInfo()
	}, [currentProfileLink, authToken, apiUrl])

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			let newAvatarPath = profileData.avatar
			if (fileUploadRef.current) {
				newAvatarPath = await fileUploadRef.current.handleUpload()
			}
			const response = await axios.put(
				`${apiUrl}/user/${currentProfileLink}/edit`,
				{ ...profileData, avatar: newAvatarPath },
				{ headers: { Authorization: `Bearer ${authToken}` } }
			)
			setUserInfo(response.data)
			setProfileData({ ...profileData, avatar: newAvatarPath })
			setEditMode(false)
		} catch (error) {
			console.error('Error updating profile:', error)
		}
	}

	const handleEditClick = () => {
		setEditMode(true)
	}

	const toggleEditMode = () => {
		setEditMode(!editMode)
	}

	const handleChange = event => {
		const { name, value } = event.target
		setProfileData({ ...profileData, [name]: value })
	}

	const formatBirthDate = isoDateString => {
		const date = new Date(isoDateString)
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		return date.toLocaleDateString('ru-RU', options)
	}

	return (
		<div className='user-profile-container'>
			{userInfo && (
				<div className='user-info'>
					<div className='avatar-info-container'>
						<div className='avatar-container'>
							<img
								src={profileData.avatar}
								alt='User Avatar'
								className='user-avatar'
							/>
							{editMode && (
								<div className='avatarSetting'>
									<FileUpload ref={fileUploadRef} />
									<button onClick={handleSubmit}>Загрузить изображение</button>
								</div>
							)}
						</div>

						<div className='text-info'>
							<div className='user-info-item'>
								<span className='user-info-label'>ФИО:</span>{' '}
								{editMode ? (
									<textarea
										name='fullname'
										value={profileData.fullname}
										onChange={handleChange}
										rows={4}
										className='edit-textarea'
									/>
								) : (
									<>{userInfo.fullname}</>
								)}
							</div>
							<div className='user-info-item'>
								<span className='user-info-label'>Образование:</span>{' '}
								{editMode ? (
									<textarea
										name='education'
										value={profileData.education}
										onChange={handleChange}
										rows={4}
										className='edit-textarea'
									/>
								) : (
									<>{userInfo.education || '-'}</>
								)}
							</div>
							<div className='user-info-item'>
								<span className='user-info-label'>Контакты:</span>{' '}
								{editMode ? (
									<textarea
										name='contacts'
										value={profileData.contacts}
										onChange={handleChange}
										rows={4}
										className='edit-textarea'
									/>
								) : (
									<>{userInfo.contacts || '-'}</>
								)}
							</div>
							<div className='user-info-item'>
								<span className='user-info-label'>Дата рождения:</span>{' '}
								{editMode ? (
									<input
										type='date'
										name='dateOfBirth'
										value={profileData.dateOfBirth}
										onChange={handleChange}
									/>
								) : (
									<>{formatBirthDate(userInfo.dateOfBirth) || '-'}</>
								)}
							</div>
							<div className='user-info-item'>
								<span className='user-info-label'>Опыт работы:</span>{' '}
								{editMode ? (
									<textarea
										name='workExperience'
										value={profileData.workExperience}
										onChange={handleChange}
										rows={4}
										className='edit-textarea'
									/>
								) : (
									<>{userInfo.workExperience || '-'}</>
								)}
							</div>
							<div className='user-info-item'>
								<span className='user-info-label'>
									Дополнительная информация:
								</span>{' '}
								{editMode ? (
									<textarea
										name='additionalInfo'
										value={profileData.additionalInfo}
										onChange={handleChange}
										rows={4}
										className='edit-textarea'
									/>
								) : (
									<>{userInfo.additionalInfo || '-'}</>
								)}
							</div>
							{currentProfileLink === userInfo.username && (
								<div className='edit-mode-button-container'>
									{editMode ? (
										<button className='edit-mode-button' onClick={handleSubmit}>
											Сохранить изменения
										</button>
									) : (
										<button
											className='edit-mode-button'
											onClick={handleEditClick}
										>
											Редактировать данные
										</button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default UserProfile
