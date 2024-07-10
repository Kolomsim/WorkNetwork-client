import React, { useState, useEffect } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import RegisterPage from './pages/LoginSignup/Signup.jsx'
import LoginPage from './pages/LoginSignup/Login.jsx'
import ChatPage from './pages/Chat/Chat.jsx'
import UserPage from './pages/UserProfile/userProfile.jsx'
import ProfilePage from './pages/UserProfile/userProfile.jsx'
import Layout from './components/Layout/Layout.jsx'
import ListOfGroups from './components/ListOfGroups/ListOfGroups.jsx'
import GroupPage from './components/Group/Group.jsx'
import ForumsPage from './components/ListOfForum/ListOfForum.jsx'
import TopicPage from './components/ForumTopic/Topic.jsx'
import JobSearch from './components/JobFound/JobFound.jsx'

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
		<Layout>
			<Routes>
				<Route path='/signup' element={<RegisterPage />} />
				<Route
					path='/login'
					element={<LoginPage setAuthenticated={setAuthenticated} />}
				/>

				<Route
					path='/chats'
					element={authenticated ? <ChatPage /> : <Navigate to='/auth/login' />}
				/>
				<Route
					path='/user/:username'
					element={authenticated ? <UserPage /> : <Navigate to='/auth/login' />}
				/>
				<Route
					path='/groups'
					element={
						authenticated ? <ListOfGroups /> : <Navigate to='/auth/login' />
					}
				/>
				<Route path='/job-search' element={<JobSearch />} />
				<Route
					path='/groups/:id'
					element={
						authenticated ? <GroupPage /> : <Navigate to='/auth/login' />
					}
				/>
				<Route
					path='/forum'
					element={
						authenticated ? <ForumsPage /> : <Navigate to='/auth/login' />
					}
				/>
				<Route
					path='/profile'
					element={
						authenticated ? <ProfilePage /> : <Navigate to='/auth/login' />
					}
				/>
				<Route
					path='/forums/:forumId'
					element={
						authenticated ? <TopicPage /> : <Navigate to='/auth/login' />
					}
				/>
				<Route
					path='*'
					element={
						authenticated ? (
							<Navigate to='/chats' />
						) : (
							<Navigate to='/auth/login' />
						)
					}
				/>
			</Routes>
		</Layout>
	)
}

function AppWrapper() {
	return (
		<Router>
			<App />
		</Router>
	)
}

export default AppWrapper
