// App.js
import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import UserPage from './pages/UserPage'
import ListOfGroups from './pages/ListOfGroups'
import JobSearch from './pages/JobSearch'
import GroupPage from './pages/GroupPage'
import ForumsPage from './pages/ForumsPage'
import ProfilePage from './pages/ProfilePage'
import TopicPage from './pages/TopicPage'

function App() {
	const [authenticated, setAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const checkAuth = () => {
			const accessToken = localStorage.getItem('accessToken')
			if (accessToken) {
				setAuthenticated(true)
			}
			setLoading(false)
		}
		checkAuth()
	}, [])

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<Routes>
			<Route path='/signup' element={<RegisterPage />} />
			<Route
				path='/login'
				element={<LoginPage setAuthenticated={setAuthenticated} />}
			/>
			<Route
				path='/*'
				element={<ProtectedRoutes authenticated={authenticated} />}
			/>
		</Routes>
	)
}

function ProtectedRoutes({ authenticated }) {
	return (
		<Layout>
			<Route
				path='/chats'
				element={authenticated ? <ChatPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/user/:username'
				element={authenticated ? <UserPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/groups'
				element={authenticated ? <ListOfGroups /> : <Navigate to='/login' />}
			/>
			<Route path='/job-search' element={<JobSearch />} />
			<Route
				path='/groups/:id'
				element={authenticated ? <GroupPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/forum'
				element={authenticated ? <ForumsPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/profile'
				element={authenticated ? <ProfilePage /> : <Navigate to='/login' />}
			/>
			<Route
				path='/forums/:forumId'
				element={authenticated ? <TopicPage /> : <Navigate to='/login' />}
			/>
			<Route
				path='*'
				element={
					authenticated ? <Navigate to='/chats' /> : <Navigate to='/login' />
				}
			/>
		</Layout>
	)
}

export default App
